import { memo, useEffect, useMemo, useRef } from "react"
import { Animated, Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import type { Character } from "../types/episodes.types"

interface CharacterCardProps {
  character: Character
}

/**
 * Reusable presentational card for an episode character.
 * It is memoized to keep long cast lists efficient.
 */
export const CharacterCard = memo(function CharacterCard({ character }: CharacterCardProps) {
  const { theme, themed } = useAppTheme()
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(100)).current

  const statusStyle = useMemo(() => {
    switch (character.status) {
      case "Alive":
        return {
          backgroundColor: theme.colors.palette.success100,
          color: theme.colors.palette.success500,
        }
      case "Dead":
        return {
          backgroundColor: theme.colors.errorBackground,
          color: theme.colors.error,
        }
      default:
        return {
          backgroundColor: theme.colors.palette.secondary100,
          color: theme.colors.palette.secondary500,
        }
    }
  }, [character.status, theme.colors])

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [opacity, translateY])

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <View style={themed($card)}>
        <Image source={{ uri: character.image }} style={themed($image)} />

        <View style={themed($content)}>
          <Text preset="bold" size="sm" style={themed($name)}>
            {character.name}
          </Text>

          <View style={[themed($badge), { backgroundColor: statusStyle.backgroundColor }]}>
            <Text size="xxs" weight="medium" style={{ color: statusStyle.color }}>
              {character.status}
            </Text>
          </View>

          <Text size="xs" style={themed($meta)}>
            {character.species} • {character.gender}
          </Text>

          {character.type ? (
            <Text size="xxs" style={themed($secondaryMeta)}>
              Type: {character.type}
            </Text>
          ) : null}

          <Text size="xxs" style={themed($secondaryMeta)}>
            Origin: {character.origin?.name || "Unknown"}
          </Text>

          <Text size="xxs" style={themed($secondaryMeta)}>
            Location: {character.location?.name || "Unknown"}
          </Text>
        </View>
      </View>
    </Animated.View>
  )
})

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignItems: "center",
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.border,
  borderRadius: 16,
  borderWidth: 1,
  flexDirection: "row",
  marginBottom: spacing.sm,
  padding: spacing.sm,
})

const $content: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $image: ThemedStyle<ImageStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.separator,
  borderRadius: 32,
  height: 64,
  marginRight: spacing.sm,
  width: 64,
})

const $name: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginBottom: spacing.xs,
})

const $meta: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.xs,
})

const $secondaryMeta: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.xxs,
})

const $badge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignSelf: "flex-start",
  borderRadius: 999,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs,
})
