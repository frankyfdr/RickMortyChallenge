import type {
  Character,
  Episode,
  EpisodesFilters,
  PaginatedResponse,
} from "../types/episodes.types"

/**
 * Service layer for the episodes feature.
 * This file is responsible only for API communication.
 */
const API_BASE_URL = "https://rickandmortyapi.com/api"

function normalizeError(error: unknown, fallbackMessage: string): Error {
  const message = error instanceof Error ? error.message.toLowerCase() : ""

  if (
    message.includes("network request failed") ||
    message.includes("failed to fetch") ||
    message.includes("offline") ||
    message.includes("network")
  ) {
    return new Error("You're offline. Check your internet connection and try again.")
  }

  if (error instanceof Error && error.message) {
    return new Error(error.message)
  }

  return new Error(fallbackMessage)
}

async function request<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("The requested Rick and Morty resource could not be found.")
      }

      throw new Error(`API request failed with status ${response.status}`)
    }

    return (await response.json()) as T
  } catch (error) {
    throw normalizeError(error, "Unable to communicate with the Rick and Morty API.")
  }
}

function extractCharacterIds(characterUrls: string[]): string {
  return characterUrls
    .map((url) => url.split("/").pop())
    .filter((value): value is string => Boolean(value))
    .join(",")
}

function buildEpisodesQuery(page: number, filters?: EpisodesFilters): string {
  const params = new URLSearchParams({ page: String(page) })

  if (filters?.name?.trim()) {
    params.set("name", filters.name.trim())
  }

  if (filters?.episode?.trim()) {
    params.set("episode", filters.episode.trim())
  }

  return params.toString()
}

export async function fetchEpisodes(
  page = 1,
  filters?: EpisodesFilters,
): Promise<PaginatedResponse<Episode>> {
  try {
    const query = buildEpisodesQuery(page, filters)
    return await request<PaginatedResponse<Episode>>(`/episode?${query}`)
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("could not be found")) {
      return {
        info: {
          count: 0,
          pages: 0,
          next: null,
          prev: null,
        },
        results: [],
      }
    }

    throw normalizeError(error, "Unable to fetch episodes.")
  }
}

export async function fetchEpisodeById(id: number): Promise<Episode> {
  try {
    return await request<Episode>(`/episode/${id}`)
  } catch (error) {
    throw normalizeError(error, "Unable to fetch the selected episode.")
  }
}

export async function fetchEpisodeCharacters(characterUrls: string[]): Promise<Character[]> {
  try {
    if (characterUrls.length === 0) {
      return []
    }

    const ids = extractCharacterIds(characterUrls)

    if (!ids) {
      return []
    }

    const response = await request<Character | Character[]>(`/character/${ids}`)
    return Array.isArray(response) ? response : [response]
  } catch (error) {
    throw normalizeError(error, "Unable to fetch episode characters.")
  }
}

export const episodesApi = {
  fetchEpisodes,
  fetchEpisodeById,
  fetchEpisodeCharacters,
  getEpisodes: fetchEpisodes,
  getEpisodeById: fetchEpisodeById,
  getCharactersByUrls: fetchEpisodeCharacters,
}
