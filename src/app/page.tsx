'use client'

import { NextComponentType } from 'next'
import * as str from '@/utils/str'
import * as R from 'remeda'

import { Charset } from '@/types/charset'
import { ASCII_CHARSET, createEmptyCharset } from '@/constants/charset'
import {
  MAX_ATTEMPTS,
  JOIN_CHAR,
  END_LINE_CHAR,
  SAMPLE_NUMBER_OF_LINES,
  DEFAULT_NUMBER_OF_LINES,
  DEFAULT_NUMBER_OF_RANDOM_CHARS,
  DEFAULT_NUMBER_OF_RANDON_LINES,
} from '@/constants/spinner'

import CharsetItem from '@/components/charset/CharsetItem'
import { useEffect, useState } from 'react'
import { useCharsets } from '@/hooks/use-charsets'

const Home: NextComponentType = () => {
  const { loadCharsets, saveCharsets, resetCharsets } = useCharsets()

  const [ready, setReady] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [output, setOutput] = useState<string>('')
  const [total, setTotal] = useState<number>(0)
  const [lines, setLines] = useState<number>(DEFAULT_NUMBER_OF_LINES)
  const [randomChars, setRandomChars] = useState<number>(DEFAULT_NUMBER_OF_RANDOM_CHARS)
  const [randomLines, setRandomLines] = useState<number>(DEFAULT_NUMBER_OF_RANDON_LINES)

  const [charsets, setCharsets] = useState<Charset[]>([])

  const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    setOutput('')
    setTotal(0)
  }

  const handleBlurInput = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setInput(str.clean(e.target.value))
  }

  const updateCharset = (index: number, charset: Charset) => {
    setCharsets((prev) => {
      return prev.map((chs) => (chs.id === charset.id ? charset : chs))
    })
  }

  const handleToggle = (index: number, value: boolean) => {
    if (charsets.filter((charset) => charset.is_enabled).length === 2 && !value) return
    updateCharset(index, { ...charsets[index], is_enabled: value })
  }

  const handleChangeText = (index: number, text: string) => {
    updateCharset(index, { ...charsets[index], text })
  }

  const handleChangeAmount = (index: number, amount: number) => {
    updateCharset(index, { ...charsets[index], amount })
  }

  const handleRemoveCharset = (index: number) => {
    const charset = charsets[index]
    if (charset.is_default) return
    setCharsets((prev) => prev.filter((chs) => chs.id !== charset.id))
  }

  const handleAddCharset = (e: React.MouseEvent<HTMLButtonElement>) => {
    const charset = createEmptyCharset()
    setCharsets((prev) => {
      const [wordCharsets, spaceCharsets] = R.partition(prev, (charset) => !charset.is_space)

      return [...wordCharsets, charset, ...spaceCharsets]
    })
  }

  const handleResetCharsets = (e: React.MouseEvent<HTMLButtonElement>) => {
    resetCharsets()
  }

  const handleChangeLines = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, e.target.valueAsNumber)
    setLines(value)
  }

  const generateOutput = (n: number): string[] => {
    if (!input) return []

    const [wordCharsets, spaceCharsets] = R.partition(charsets, (charset) => !charset.is_space)
    const enableCharsets = wordCharsets.filter((charset) => charset.is_enabled)
    const mappings = enableCharsets.map((charset) =>
      Object.fromEntries(R.zip(str.list(ASCII_CHARSET.text), str.list(charset.text))),
    )
    const words = str.clean(input).split(/\s/)
    const seeds = R.flatten(
      enableCharsets.map((charset, idx) => R.range(0, charset.amount).fill(idx)),
    )

    let attempts = 0
    const listIndexes = new Set<string>()
    while (listIndexes.size < n) {
      if (attempts >= MAX_ATTEMPTS) break
      const indexes = words.map(() => str.choice(seeds)).join(JOIN_CHAR)
      if (listIndexes.has(indexes)) {
        attempts += 1
        continue
      }
      listIndexes.add(indexes)
    }

    const outputs: string[] = []
    listIndexes.forEach((indexes) => {
      let out = ''
      for (const [word, index] of R.zip(words, str.list(indexes, JOIN_CHAR))) {
        let curr = ''
        for (const char of str.list(word)) {
          curr += mappings[parseInt(index)][char] || char
        }
        out += `${curr} `
      }
      outputs.push(out.trim())
    })

    return interpolateSpaceCharsets(outputs, spaceCharsets)
  }

  const interpolateSpaceCharsets = (outputs: string[], spaceCharsets: Charset[]): string[] => {
    const selectedCharset = spaceCharsets
      .filter((charset) => charset.is_space && charset.is_enabled)
      .pop()
    if (!selectedCharset) return outputs

    const mapFn = (output: string): string => {
      const chars = str.list(selectedCharset.text)
      return output.replace(/\s/g, () => str.choice(chars))
    }

    return outputs.map((output) => mapFn(output))
  }

  const handleSample = (e: React.MouseEvent<HTMLButtonElement>) => {
    const outputs = generateOutput(SAMPLE_NUMBER_OF_LINES)
    setOutput(outputs.join(END_LINE_CHAR))
    setTotal(outputs.length)
  }

  const handleGenerate = (e: React.MouseEvent<HTMLButtonElement>) => {
    const outputs = generateOutput(lines)
    setOutput(outputs.join(END_LINE_CHAR))
    setTotal(outputs.length)
  }

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOutput('')
    setTotal(0)
  }

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(output)
  }

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    let outputs = generateOutput(lines)
    if (outputs.length === 0) return
    outputs = outputs.map((line) => line + END_LINE_CHAR)
    const file = new File(outputs, 'outputs.txt', { type: 'text/plain' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(file)

    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleChangeRandomChars = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, e.target.valueAsNumber)
    setRandomChars(value)
  }

  const handleChangeRandomLines = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, e.target.valueAsNumber)
    setRandomLines(value)
  }

  const generateRandoms = (nchars: number, nlines: number): string[] => {
    let attempts = 0
    const listRandoms = new Set<string>()

    while (listRandoms.size < nlines) {
      if (attempts >= MAX_ATTEMPTS) break
      const random = R.randomString(nchars)
      if (listRandoms.has(random)) {
        attempts += 1
        continue
      }
      listRandoms.add(random)
    }

    return Array.from(listRandoms)
  }

  const handleRandom = (e: React.MouseEvent<HTMLButtonElement>) => {
    const outputs = generateRandoms(randomChars, randomLines)
    setOutput(outputs.join(END_LINE_CHAR))
    setTotal(outputs.length)
  }

  useEffect(() => {
    if (ready) saveCharsets(charsets)
  }, [ready, charsets, saveCharsets])

  useEffect(() => {
    setCharsets(loadCharsets())
    setReady(true)
  }, [loadCharsets])

  return (
    <div className="flex h-full w-full">
      <div data-qa="left" className="mr-10 w-[40%] flex-grow">
        <div className="mb-1">Charsets</div>
        {charsets.map((charset: Charset, idx: number) => (
          <CharsetItem
            key={charset.id}
            charset={charset}
            onToggle={(val) => handleToggle(idx, val)}
            onChangeText={(val) => handleChangeText(idx, val)}
            onChangeAmount={(val) => handleChangeAmount(idx, val)}
            onRemove={() => handleRemoveCharset(idx)}
          />
        ))}
        <div className="flex items-center gap-x-4">
          <button
            onClick={handleAddCharset}
            disabled={!charsets.filter((charset) => !charset.is_space).pop()?.text}
            className="rounded border border-black/40 px-4 py-2 transition hover:bg-black/10 disabled:cursor-not-allowed"
          >
            Add Charset
          </button>
          <button
            onClick={handleResetCharsets}
            className="rounded border border-black/40 px-4 py-2 transition hover:bg-black/10"
          >
            Reset Charsets
          </button>
        </div>
      </div>
      <div data-qa="right" className="w-[60%] flex-grow">
        {/* Spin */}
        <div data-qa="input" className="mb-2">
          <div className="mb-1">Spin</div>
          <textarea
            rows={3}
            name="input"
            value={input}
            onBlur={handleBlurInput}
            onChange={handleChangeInput}
            className="w-full resize-none rounded border border-black/40 px-3 py-2"
          />
        </div>
        <div data-qa="actions" className="mb-2 flex items-center gap-x-4">
          <button
            type="button"
            className="rounded border border-black/40 px-4 py-2 transition hover:bg-black/10"
            title="Tạo spin (10 dòng)"
            onClick={handleSample}
          >
            Sample ({SAMPLE_NUMBER_OF_LINES})
          </button>
          <input
            type="number"
            min={50}
            step={50}
            value={lines}
            onChange={handleChangeLines}
            title="Số lượng dòng spin"
            className="w-20 rounded border border-black/40 p-2"
          />
          <button
            type="button"
            title="Tạo spin (n dòng)"
            className="rounded border border-black/40 px-4 py-2 transition hover:bg-black/10"
            onClick={handleGenerate}
          >
            Generate
          </button>
        </div>

        {/* Random */}
        <div data-qa="tools">
          <div className="mb-2">Random</div>
          <div data-qa="tool-item" className="mb-2 flex items-center gap-x-4">
            <input
              type="number"
              min={1}
              step={1}
              value={randomChars}
              onChange={handleChangeRandomChars}
              title="Số ký tự trong chuỗi ngẫu nhiên"
              className="w-20 rounded border border-black/40 p-2"
            />
            <input
              type="number"
              min={1}
              step={50}
              value={randomLines}
              onChange={handleChangeRandomLines}
              title="Sô lượng chuỗi ngẫu nhiên"
              className="w-20 rounded border border-black/40 p-2"
            />
            <button
              type="button"
              onClick={handleRandom}
              title="Tạo random (n dòng)"
              className="rounded border border-black/40 px-4 py-2 transition hover:bg-black/10"
            >
              Random
            </button>
          </div>
        </div>

        {/* Output */}
        <div data-qa="output" className="mb-2">
          <div className="mb-1">
            <span>Output</span>
            <span>{total > 0 && ` - Total: ${total.toLocaleString()}`}</span>
          </div>
          <textarea
            readOnly
            rows={25}
            name="output"
            value={output}
            className="w-full rounded border border-black/40 px-3 py-2"
          />
        </div>

        {/* Actions */}
        <div data-qa="actions" className="flex items-center gap-x-3">
          <button
            type="button"
            className="rounded border border-black/40 px-4 py-2 transition hover:bg-black/10"
            title="Xóa nội dung output"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            type="button"
            className="rounded border border-black/40 px-4 py-2 transition hover:bg-black/10"
            title="Sao chép nội dung output"
            onClick={handleCopy}
          >
            Copy
          </button>
          <button
            type="button"
            onClick={handleDownload}
            title="Tải nội dung output"
            className="rounded border border-black/40 bg-black/70 px-4 py-2 text-white transition hover:bg-black/60"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
