import { useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native"

import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { CharacterCard } from "../features/episodes/components/CharacterCard"
import { useEpisodeCharacters } from "../features/episodes/hooks/useEpisodeCharacters"
import { episodesApi } from "../features/episodes/services/episodesApi"
import type { Episode } from "../features/episodes/types/episodes.types"

type EpisodeDetailScreenProps = AppStackScreenProps<"EpisodeDetail">

/**
 * Container screen for a single episode.
 * It focuses on composition: episode summary at the top and characters below.
 */
export function EpisodeDetailScreen({ route }: EpisodeDetailScreenProps) {
  const routeEpisode = route.params?.episode
  const episodeId = route.params?.episodeId ?? routeEpisode?.id
  const [episode, setEpisode] = useState<Episode | null>(routeEpisode ?? null)
  const [episodeLoading, setEpisodeLoading] = useState(!routeEpisode && Boolean(episodeId))
  const [episodeError, setEpisodeError] = useState<string | null>(null)
  const { characters, loading, error, refetch } = useEpisodeCharacters(episode?.characters ?? [])
  const { themed, theme } = useAppTheme()
  const { width } = useWindowDimensions()

  const contentMaxWidth = Math.min(width - 32, 760)

  const loadEpisode = useCallback(async () => {
    if (routeEpisode) {
      setEpisode(routeEpisode)
      setEpisodeLoading(false)
      setEpisodeError(null)
      return
    }

    if (!episodeId) {
      setEpisode(null)
      setEpisodeLoading(false)
      setEpisodeError("No episode information was provided.")
      return
    }

    try {
      setEpisodeLoading(true)
      setEpisodeError(null)
      const response = await episodesApi.fetchEpisodeById(episodeId)
      setEpisode(response)
    } catch (fetchError) {
      setEpisodeError(
        fetchError instanceof Error ? fetchError.message : "Unable to load this episode.",
      )
    } finally {
      setEpisodeLoading(false)
    }
  }, [episodeId, routeEpisode])

  useEffect(() => {
    void loadEpisode()
  }, [loadEpisode])

  const handleRetry = useCallback(async () => {
    await loadEpisode()

    if (episode || routeEpisode) {
      await refetch()
    }
  }, [episode, loadEpisode, refetch, routeEpisode])

  if (episodeLoading && !episode) {
    return (
      <View style={themed($centered)}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
        <Text style={themed($helperText)}>Loading episode...</Text>
      </View>
    )
  }

  if (!episode) {
    return (
      <View style={themed($centered)}>
        <Text preset="subheading" style={themed($emptyTitle)}>
          Unable to open episode
        </Text>
        <Text style={themed($emptyText)}>{episodeError ?? "Try returning to the list."}</Text>
        <Pressable onPress={() => void handleRetry()} style={themed($retryButton)}>
          <Text weight="medium" style={themed($retryLabel)}>
            Retry
          </Text>
        </Pressable>
      </View>
    )
  }

  return (
    <SafeAreaView style={themed($container)}>
      <FlatList
        data={characters}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={themed($listContent)}
        showsVerticalScrollIndicator={false}
        refreshing={loading && characters.length > 0}
        onRefresh={() => void refetch()}
        removeClippedSubviews
        initialNumToRender={8}
        windowSize={8}
        ListHeaderComponent={
          <View style={[themed($headerCard), { maxWidth: contentMaxWidth }]}>
            <Text preset="heading" size="xl" style={themed($title)}>
              {episode.name}
            </Text>
            <Text size="xs" style={themed($meta)}>
              Episode code: {episode.episode}
            </Text>
            <Text size="xs" style={themed($meta)}>
              Air date: {episode.air_date}
            </Text>
            <Text size="xs" style={themed($meta)}>
              Characters: {episode.characters.length}
            </Text>
            <Text size="xxs" style={themed($refreshHint)}>
              Pull down to refresh character data.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[themed($cardWrapper), { maxWidth: contentMaxWidth }]}>
            <CharacterCard character={item} />
          </View>
        )}
        ListEmptyComponent={
          <View style={[themed($messageBox), { maxWidth: contentMaxWidth }]}>
            {loading ? (
              <>
                <ActivityIndicator size="small" color={theme.colors.tint} />
                <Text style={themed($helperText)}>Loading characters...</Text>
              </>
            ) : error || episodeError ? (
              <>
                <Text style={themed($errorText)}>{error ?? episodeError}</Text>
                <Pressable onPress={() => void handleRetry()} style={themed($retryButton)}>
                  <Text weight="medium" style={themed($retryLabel)}>
                    Retry
                  </Text>
                </Pressable>
              </>
            ) : (
              <Text style={themed($helperText)}>No characters found for this episode.</Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  )
}

const $centered: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignItems: "center",
  backgroundColor: colors.background,
  flex: 1,
  justifyContent: "center",
  padding: spacing.lg,
})

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  flex: 1,
})

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
})

const $emptyTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginBottom: spacing.xs,
})

const $headerCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignSelf: "center",
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.border,
  borderRadius: 16,
  borderWidth: 1,
  marginBottom: spacing.md,
  padding: spacing.md,
  width: "100%",
})

const $helperText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.xs,
  textAlign: "center",
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  flexGrow: 1,
})

const $cardWrapper: ThemedStyle<ViewStyle> = () => ({
  alignSelf: "center",
  width: "100%",
})

const $messageBox: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignItems: "center",
  alignSelf: "center",
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  padding: spacing.lg,
  width: "100%",
})

const $refreshHint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.sm,
})

const $errorText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.error,
  marginBottom: spacing.sm,
  textAlign: "center",
})

const $retryButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.tint,
  borderRadius: 999,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
})

const $retryLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})

const $meta: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginBottom: spacing.xxs,
})

const $title: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginBottom: spacing.xs,
})
