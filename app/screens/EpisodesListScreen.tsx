import { memo, useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  SafeAreaView,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

import { PressableIcon } from "@/components/Icon"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { EpisodeCard } from "../features/episodes/components/EpisodeCard"
import { useEpisodes } from "../features/episodes/hooks/useEpisodes"
import type { Episode } from "../features/episodes/types/episodes.types"

type EpisodesListScreenProps = AppStackScreenProps<"EpisodesList">
type EpisodesSearchHeaderProps = {
  onSearchChange: (value: string) => void
  onToggleTheme: () => void
  themeContext: "light" | "dark"
}
type EpisodesListContentProps = {
  episodes: Episode[]
  loading: boolean
  error: string | null
  hasSearchQuery: boolean
  onRefresh: () => void
  onRetry: () => void
  onPressEpisode: (episode: Episode) => void
}

const SEARCH_DEBOUNCE_MS = 350

const EpisodesSearchHeader = memo(function EpisodesSearchHeader({
  onSearchChange,
  onToggleTheme,
  themeContext,
}: EpisodesSearchHeaderProps) {
  const { themed, theme } = useAppTheme()
  const [localSearchQuery, setLocalSearchQuery] = useState("")

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(localSearchQuery)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
  }, [localSearchQuery, onSearchChange])

  return (
    <View style={themed($header)}>
      <View style={themed($headerTopRow)}>
        <View style={themed($headerCopy)}>
          <Text preset="heading" size="xl" style={themed($title)}>
            Rick and Morty Episodes
          </Text>
          <Text size="xs" style={themed($subtitle)}>
            Browse the catalog and open an episode to see its cast.
          </Text>
        </View>

        <PressableIcon
          icon={themeContext === "dark" ? "view" : "hidden"}
          size={18}
          color={theme.colors.palette.neutral100}
          accessibilityLabel="Toggle theme"
          onPress={onToggleTheme}
          containerStyle={themed($themeToggle)}
        />
      </View>

      <View style={themed($searchContainer)}>
        <TextField
          value={localSearchQuery}
          onChangeText={setLocalSearchQuery}
          placeholder="Search by episode name or code"
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={themed($searchFieldContainer)}
          inputWrapperStyle={themed($searchInputWrapper)}
          style={themed($searchInput)}
        />
        <Text size="xxs" style={themed($searchHint)}>
          Pull down to refresh the latest episodes.
        </Text>
      </View>
    </View>
  )
})

const EpisodesListContent = memo(function EpisodesListContent({
  episodes,
  loading,
  error,
  hasSearchQuery,
  onRefresh,
  onRetry,
  onPressEpisode,
}: EpisodesListContentProps) {
  const { themed, theme } = useAppTheme()

  const keyExtractor = useCallback((item: Episode) => String(item.id), [])

  const renderItem = useCallback<ListRenderItem<Episode>>(
    ({ item }) => <EpisodeCard episode={item} onPress={onPressEpisode} />,
    [onPressEpisode],
  )

  if (loading && episodes.length === 0) {
    return (
      <View style={themed($centered)}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
        <Text style={themed($helperText)}>Loading episodes...</Text>
      </View>
    )
  }

  return (
    <>
      {error ? (
        <View style={themed($messageBox)}>
          <Text style={themed($errorText)}>{error}</Text>
          <Pressable onPress={() => void onRetry()} style={themed($retryButton)}>
            <Text weight="medium" style={themed($retryLabel)}>
              Try again
            </Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={episodes}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={themed($listContent)}
        removeClippedSubviews
        initialNumToRender={8}
        windowSize={10}
        refreshing={loading && episodes.length > 0}
        onRefresh={() => void onRefresh()}
        ListEmptyComponent={
          <View style={themed($messageBox)}>
            <Text style={themed($helperText)}>
              {hasSearchQuery ? "No episodes match your search." : "No episodes available."}
            </Text>
          </View>
        }
      />
    </>
  )
})

/**
 * Episodes list screen responsible only for layout and navigation.
 * Search and list rendering are separated to reduce unnecessary re-renders.
 */
export function EpisodesListScreen({ navigation }: EpisodesListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { episodes, loading, error, refresh, refetch } = useEpisodes(searchQuery)
  const { themed, themeContext, setThemeContextOverride } = useAppTheme()

  const toggleTheme = useCallback(() => {
    setThemeContextOverride(themeContext === "dark" ? "light" : "dark")
  }, [setThemeContextOverride, themeContext])

  const handlePressEpisode = useCallback(
    (episode: Episode) => {
      navigation.navigate("EpisodeDetail", { episode, episodeId: episode.id })
    },
    [navigation],
  )

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])

  return (
    <SafeAreaView style={themed($container)}>
      <EpisodesSearchHeader
        onSearchChange={handleSearchChange}
        onToggleTheme={toggleTheme}
        themeContext={themeContext}
      />

      <EpisodesListContent
        episodes={episodes}
        loading={loading}
        error={error}
        hasSearchQuery={Boolean(searchQuery.trim())}
        onRefresh={refresh}
        onRetry={refetch}
        onPressEpisode={handlePressEpisode}
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

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
})

const $headerTopRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "flex-start",
  flexDirection: "row",
  gap: spacing.sm,
  justifyContent: "space-between",
})

const $headerCopy: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $themeToggle: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignItems: "center",
  backgroundColor: colors.tint,
  borderRadius: 999,
  height: 36,
  justifyContent: "center",
  marginTop: spacing.xxs,
  width: 36,
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $subtitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.xxs,
})

const $searchContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $searchFieldContainer: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 0,
})

const $searchInputWrapper: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.border,
  borderRadius: 12,
  borderWidth: 1,
})

const $searchInput: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $searchHint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.xs,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  flexGrow: 1,
})

const $messageBox: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  marginHorizontal: spacing.md,
  marginTop: spacing.md,
  padding: spacing.md,
})

const $helperText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.xs,
  textAlign: "center",
})

const $errorText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.error,
  marginBottom: spacing.sm,
})

const $retryButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignSelf: "flex-start",
  backgroundColor: colors.tint,
  borderRadius: 999,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
})

const $retryLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})
