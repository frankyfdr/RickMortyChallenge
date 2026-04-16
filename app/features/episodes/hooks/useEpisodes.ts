import { useCallback, useEffect, useMemo, useState } from "react"

import { episodesApi } from "../services/episodesApi"
import type { Episode, UseEpisodesResult } from "../types/episodes.types"

/**
 * Feature hook responsible for loading episodes and exposing UI-friendly state.
 * Filtering is delegated to the API layer using supported query params.
 */
export function useEpisodes(searchQuery = ""): UseEpisodesResult {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const normalizedQuery = useMemo(() => searchQuery.trim(), [searchQuery])

  const loadEpisodes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = normalizedQuery
        ? await episodesApi.fetchEpisodes(1, { name: normalizedQuery }).then(async (result) => {
            if (result.results.length > 0) {
              return result
            }

            return episodesApi.fetchEpisodes(1, { episode: normalizedQuery })
          })
        : await episodesApi.fetchEpisodes()

      setEpisodes(response.results)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load episodes.")
    } finally {
      setLoading(false)
    }
  }, [normalizedQuery])

  useEffect(() => {
    void loadEpisodes()
  }, [loadEpisodes])

  const refresh = useCallback(async () => {
    await loadEpisodes()
  }, [loadEpisodes])

  return useMemo(
    () => ({
      episodes,
      loading,
      error,
      refresh,
      refetch: loadEpisodes,
    }),
    [episodes, loading, error, refresh, loadEpisodes],
  )
}
