
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  type ViewProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps extends ViewProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  textStyle?: StyleProp<TextStyle>;
}

const Badge = React.forwardRef<View, BadgeProps>(
  ({ children, variant = 'default', style, textStyle, ...props }, ref) => {
    const containerStyle = [styles.container, variantStyles[variant].container];
    const labelStyle = [styles.text, variantStyles[variant].text];

    return (
      <View ref={ref} style={[containerStyle, style]} {...props}>
        <Text style={[labelStyle, textStyle]}>{children}</Text>
      </View>
    );
  }
);
Badge.displayName = 'Badge';

// --- STYLES --- //

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999, // Fully rounded
    borderWidth: 1,
    alignSelf: 'flex-start', // w-fit equivalent
  },
  text: {
    fontSize: 10,
    fontWeight: '500',
  },
});

// Variant Styles
const variantStyles = {
  default: StyleSheet.create({
    container: { backgroundColor: '#16a34a', borderColor: 'transparent' },
    text: { color: '#ffffff' },
  }),
  secondary: StyleSheet.create({
    container: { backgroundColor: '#f3f4f6', borderColor: 'transparent' },
    text: { color: '#374151' },
  }),
  destructive: StyleSheet.create({
    container: { backgroundColor: '#dc2626', borderColor: 'transparent' },
    text: { color: '#ffffff' },
  }),
  outline: StyleSheet.create({
    container: { backgroundColor: 'transparent', borderColor: '#e5e7eb' },
    text: { color: '#374151' },
  }),
};

export { Badge };
