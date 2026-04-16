import { memo, useEffect, useRef } from "react"
import { Animated, Pressable, TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import type { Episode } from "../types/episodes.types"

interface EpisodeCardProps {
  episode: Episode
  onPress?: (episode: Episode) => void
}

/**
 * Pure presentational card for a single episode.
 * It stays reusable and memoized so list rendering remains efficient.
 */
export const EpisodeCard = memo(function EpisodeCard({ episode, onPress }: EpisodeCardProps) {
  const { themed } = useAppTheme()
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(10)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
  }, [opacity, translateY])

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable
        accessibilityRole="button"
        onPress={() => onPress?.(episode)}
        style={({ pressed }) => [themed($card), pressed && themed($pressedCard)]}
      >
        <View style={themed($badge)}>
          <Text preset="bold" size="xxs" style={themed($badgeText)}>
            {episode.episode}
          </Text>
        </View>

        <Text preset="bold" size="md" style={themed($title)}>
          {episode.name}
        </Text>
        <Text size="xs" style={themed($meta)}>
          Air date: {episode.air_date}
        </Text>
        <Text size="xxs" style={themed($secondaryMeta)}>
          Characters: {episode.characters.length}
        </Text>
      </Pressable>
    </Animated.View>
  )
})

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.border,
  borderRadius: 16,
  borderWidth: 1,
  marginBottom: spacing.sm,
  padding: spacing.md,
})

const $pressedCard: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  opacity: 0.9,
})

const $badge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignSelf: "flex-start",
  backgroundColor: colors.tint,
  borderRadius: 999,
  marginBottom: spacing.sm,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs,
})

const $badgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})

const $title: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginBottom: spacing.xxs,
})

const $meta: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $secondaryMeta: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.xxs,
})
