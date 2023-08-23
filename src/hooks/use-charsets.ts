import { useCallback } from 'react'
import { Charset } from '@/types/charset'
import { DEFAULT_CHARSETS } from '@/constants/charset'
import * as R from 'remeda'

export const useCharsets = () => {
  const loadCharsets = useCallback(() => {
    try {
      const charsets = JSON.parse(localStorage.getItem('charsets') || '')
      return charsets as Charset[]
    } catch {}

    return R.clone(DEFAULT_CHARSETS)
  }, [])

  const saveCharsets = useCallback((charsets: Charset[]) => {
    if (R.uniqBy(charsets, (c) => c.id).length === charsets.length) {
      localStorage.setItem('charsets', JSON.stringify(charsets))
    }
  }, [])

  const resetCharsets = useCallback(() => {
    if (window.confirm('Are you sure you want to reset charsets?')) {
      localStorage.removeItem('charsets')
      window.location.reload()
    }
  }, [])

  return { loadCharsets, saveCharsets, resetCharsets }
}
