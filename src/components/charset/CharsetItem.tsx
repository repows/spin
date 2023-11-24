import { NextComponentType } from 'next'
import classnames from 'classnames'

import { Charset } from '@/types/charset'
import { ASCII_CHARSET } from '@/constants/charset'

type Props = {
  className?: string
  charset: Charset
  onToggle: (value: boolean) => void
  onChangeText: (value: string) => void
  onChangeAmount: (value: number) => void
  onRemove: () => void
}

const CharsetItem: NextComponentType<{}, {}, Props> = ({
  className,
  charset,
  onToggle,
  onChangeText,
  onChangeAmount,
  onRemove,
}) => {
  const error = charset.text.length !== ASCII_CHARSET.text.length
  const title = charset.is_space ? 'Space Charset' : 'Standard Charset'

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (charset.is_ascii) return
    onToggle(e.target.checked)
  }

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    onChangeText(value)
  }

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, e.target.valueAsNumber)
    onChangeAmount(value)
  }

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (charset.is_default) return
    onChangeText('')
  }

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (charset.is_default) return
    onRemove()
  }

  const handleSelectCharset = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!charset.is_default) return
    if (charset.is_ascii) return
    onToggle(!charset.is_enabled)
  }

  return (
    <div className={classnames(className, 'mb-4 flex items-center gap-x-4')} title={charset.title}>
      <input
        type="checkbox"
        onChange={handleToggle}
        checked={charset.is_enabled}
        className="h-8 w-8 shrink-0 cursor-pointer accent-black/80"
      />
      <input
        type="text"
        value={charset.text}
        onChange={handleChangeText}
        onClick={handleSelectCharset}
        readOnly={charset.is_default}
        className={classnames(
          'w-full cursor-pointer rounded border border-black/30 p-2 read-only:bg-black/7 focus:border-black/60 focus:outline-none',
          {
            '!border-red-500 !bg-red-50': error && charset.is_enabled && !charset.is_space,
            '!w-1/2': charset.is_space,
          },
        )}
      />

      {!charset.is_default && !charset.is_space && (
        <>
          <button
            type="button"
            onClick={handleClear}
            title="Clear charset content"
            className="rounded border border-black/40 px-4 py-2 transition hover:bg-black/10"
          >
            C
          </button>
          <button
            type="button"
            onClick={handleRemove}
            title="Remove this charset"
            className="rounded border border-black/40 px-4 py-2 transition hover:bg-black/10"
          >
            X
          </button>
        </>
      )}
      {!charset.is_space && (
        <input
          type="number"
          min={1}
          step={1}
          value={charset.amount}
          onChange={handleChangeAmount}
          title="The amount of times this charset will be repeated"
          className="w-14 rounded border border-black/30 p-2 focus:border-black/60 focus:outline-none"
        />
      )}
    </div>
  )
}

export default CharsetItem
