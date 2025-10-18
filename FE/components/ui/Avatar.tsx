
import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';

// The original component from Radix is a compound component with Root, Image, and Fallback.
// For React Native, we'll create a single flexible container.
// The parent component can then decide what to render inside (Image, Icon, etc.).

interface AvatarProps extends ViewProps {
  children: React.ReactNode;
}

const Avatar = React.forwardRef<View, AvatarProps>(({ children, style, ...props }, ref) => {
  // The style prop can be used to pass custom sizes (height, width, borderRadius)
  return (
    <View ref={ref} style={[styles.avatar, style]} {...props}>
      {children}
    </View>
  );
});
Avatar.displayName = 'Avatar';

const styles = StyleSheet.create({
  avatar: {
    position: 'relative',
    flexShrink: 0,
    overflow: 'hidden',
    // Default size, can be overridden by style prop
    height: 40,
    width: 40,
    borderRadius: 20, // half of height/width
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6', // default fallback background
  },
});

export { Avatar };
