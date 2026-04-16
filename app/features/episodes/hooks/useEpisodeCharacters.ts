import { useCallback, useEffect, useMemo, useState } from "react"

import { episodesApi } from "../services/episodesApi"
import type { Character, UseEpisodeCharactersResult } from "../types/episodes.types"

const characterCache = new Map<string, Character[]>()

/**
 * Feature hook for loading the characters attached to a selected episode.
 * It memoizes repeated requests so the same episode cast is not fetched unnecessarily.
 */
export function useEpisodeCharacters(characterUrls: string[]): UseEpisodeCharactersResult {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const normalizedUrls = useMemo(
    () => [...new Set(characterUrls.filter(Boolean))].sort(),
    [characterUrls],
  )

  const cacheKey = useMemo(() => normalizedUrls.join(","), [normalizedUrls])

  const loadCharacters = useCallback(async () => {
    if (!cacheKey) {
      setCharacters([])
      setError(null)
      setLoading(false)
      return
    }

    const cachedCharacters = characterCache.get(cacheKey)
    if (cachedCharacters) {
      setCharacters(cachedCharacters)
      setError(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await episodesApi.fetchEpisodeCharacters(normalizedUrls)
      characterCache.set(cacheKey, response)
      setCharacters(response)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load characters.")
    } finally {
      setLoading(false)
    }
  }, [cacheKey, normalizedUrls])

  useEffect(() => {
    void loadCharacters()
  }, [loadCharacters])

  return useMemo(
    () => ({
      characters,
      loading,
      error,
      refetch: loadCharacters,
    }),
    [characters, loading, error, loadCharacters],
  )
}
