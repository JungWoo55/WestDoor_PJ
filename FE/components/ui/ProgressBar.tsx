import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';

interface ProgressBarProps extends ViewProps {
  progress: number; // 0 to 100
}

const ProgressBar = React.forwardRef<View, ProgressBarProps>(
  ({ progress, style, ...props }, ref) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));

    return (
      <View ref={ref} style={[styles.container, style]} {...props}>
        <View style={[styles.indicator, { width: `${clampedProgress}%` }]} />
      </View>
    );
  }
);
ProgressBar.displayName = 'ProgressBar';

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: '100%',
    backgroundColor: '#e5e7eb', // gray-200
    borderRadius: 999,
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
    backgroundColor: '#16a34a', // primary color
    borderRadius: 999,
  },
});

export { ProgressBar };
