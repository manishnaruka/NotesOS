import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

function SkeletonLine({ width, style }: { width: string | number; style?: object }) {
  const theme = useTheme()
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    )
    animation.start()
    return () => animation.stop()
  }, [opacity])

  return (
    <Animated.View
      style={[
        styles.line,
        { width, backgroundColor: theme.surfaceHover, opacity },
        style,
      ]}
    />
  )
}

function SkeletonItem() {
  return (
    <View style={styles.item}>
      <SkeletonLine width="65%" />
      <SkeletonLine width="90%" style={{ marginTop: 6 }} />
      <SkeletonLine width="30%" style={{ marginTop: 4 }} />
    </View>
  )
}

export function SkeletonLoader({ count = 6 }: { count?: number }) {
  const theme = useTheme()
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.row, { borderBottomColor: theme.border }]}>
          <SkeletonItem />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  item: {
    gap: 2,
  },
  line: {
    height: 12,
    borderRadius: 6,
  },
})
