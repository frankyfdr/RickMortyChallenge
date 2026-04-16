/**
 * Shared and reusable contracts for the Rick and Morty episodes feature.
 * Keep API models here so screens, hooks, and services all depend on the same types.
 */

export type CharacterStatus = "Alive" | "Dead" | "unknown"
export type CharacterGender = "Female" | "Male" | "Genderless" | "unknown"

export interface ApiInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface ApiResource {
  id: number
  name: string
  url: string
  created: string
}

export interface Episode extends ApiResource {
  air_date: string
  episode: string
  characters: string[]
}

export interface CharacterReference {
  name: string
  url: string
}

export interface Character extends ApiResource {
  status: CharacterStatus
  species: string
  type: string
  gender: CharacterGender
  image: string
  origin: CharacterReference
  location: CharacterReference
}

export interface PaginatedResponse<T> {
  info: ApiInfo
  results: T[]
}

export interface EpisodesFilters {
  name?: string
  episode?: string
}

export interface UseEpisodesResult {
  episodes: Episode[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  refetch: () => Promise<void>
}

export interface UseEpisodeCharactersResult {
  characters: Character[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}
