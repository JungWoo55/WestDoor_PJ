
import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';

interface SeparatorProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
}

const Separator = React.forwardRef<View, SeparatorProps>(
  ({ style, orientation = 'horizontal', ...props }, ref) => {
    const separatorStyle = orientation === 'horizontal' ? styles.horizontal : styles.vertical;
    return <View ref={ref} style={[styles.separator, separatorStyle, style]} {...props} />;
  }
);
Separator.displayName = 'Separator';

const styles = StyleSheet.create({
  separator: {
    backgroundColor: '#e5e7eb', // Corresponds to bg-border
  },
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});

export { Separator };
