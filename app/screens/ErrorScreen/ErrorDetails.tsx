import { ErrorInfo } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export interface ErrorDetailsProps {
  error: Error
  errorInfo: ErrorInfo | null
  onReset(): void
}

/**
 * Renders the error details screen.
 * @param {ErrorDetailsProps} props - The props for the `ErrorDetails` component.
 * @returns {JSX.Element} The rendered `ErrorDetails` component.
 */
export function ErrorDetails(props: ErrorDetailsProps) {
  const { themed } = useAppTheme()
  const showDebugDetails = __DEV__

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={themed($contentContainer)}
    >
      <View style={themed($card)}>
        <View style={themed($iconContainer)}>
          <Icon icon="ladybug" size={40} />
        </View>

        <View style={themed($topSection)}>
          <Text style={themed($heading)} preset="subheading" tx="errorScreen:title" />
          <Text style={themed($subtitle)} tx="errorScreen:friendlySubtitle" />
        </View>

        {showDebugDetails ? (
          <ScrollView
            style={themed($errorSection)}
            contentContainerStyle={themed($errorSectionContentContainer)}
          >
            <Text style={themed($errorContent)} weight="bold" text={`${props.error}`.trim()} />
            <Text
              selectable
              style={themed($errorBacktrace)}
              text={`${props.errorInfo?.componentStack ?? ""}`.trim()}
            />
          </ScrollView>
        ) : null}

        <Button
          preset="filled"
          style={themed($resetButton)}
          onPress={props.onReset}
          tx="errorScreen:reset"
        />
      </View>
    </Screen>
  )
}

const $contentContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignItems: "center",
  backgroundColor: colors.background,
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xl,
})

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignSelf: "stretch",
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.border,
  borderRadius: 20,
  borderWidth: 1,
  maxWidth: 560,
  padding: spacing.lg,
  width: "100%",
})

const $iconContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignItems: "center",
  backgroundColor: colors.errorBackground,
  borderRadius: 999,
  height: 72,
  justifyContent: "center",
  marginBottom: spacing.md,
  overflow: "hidden",
  width: 72,
})

const $topSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $heading: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginBottom: spacing.xs,
  textAlign: "center",
})

const $subtitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
})

const $errorSection: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.separator,
  borderRadius: 12,
  marginBottom: spacing.md,
  maxHeight: 220,
})

const $errorSectionContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
})

const $errorContent: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
})

const $errorBacktrace: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.md,
})

const $resetButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
  width: "100%",
})
