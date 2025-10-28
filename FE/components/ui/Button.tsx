
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type TouchableOpacityProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

// Based on the variants from the original button.tsx file
type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  textStyle?: StyleProp<TextStyle>;
}

const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  ({ children, variant = 'default', size = 'default', style, textStyle, ...props }, ref) => {
    // The button is a container (TouchableOpacity) with a text label inside
    // We apply different styles based on variant and size
    const containerStyle = [styles.container, variantStyles[variant].container, sizeStyles[size].container];
    const labelStyle = [styles.text, variantStyles[variant].text, sizeStyles[size].text];

    // If the child is just text, wrap it in a Text component
    const content = typeof children === 'string' ? (
      <Text style={[labelStyle, textStyle]}>{children}</Text>
    ) : (
      // If the child is an icon or other component, render it directly
      children
    );

    return (
      <TouchableOpacity ref={ref} style={[containerStyle, style]} {...props}>
        {content}
      </TouchableOpacity>
    );
  }
);
Button.displayName = 'Button';

// --- STYLES --- //

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderRadius: 8,
    // transition-all is not a direct equivalent in RN
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    whiteSpace: 'nowrap', // Not directly supported, but good for reference
  },
});

// Variant Styles
const variantStyles = {
  default: StyleSheet.create({
    container: { backgroundColor: '#16a34a', /* primary */ },
    text: { color: '#ffffff' /* primary-foreground */ },
  }),
  destructive: StyleSheet.create({
    container: { backgroundColor: '#dc2626' /* destructive */ },
    text: { color: '#ffffff' },
  }),
  outline: StyleSheet.create({
    container: { borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: 'transparent' },
    text: { color: '#1f2937' /* foreground */ },
  }),
  secondary: StyleSheet.create({
    container: { backgroundColor: '#f3f4f6' /* secondary */ },
    text: { color: '#374151' /* secondary-foreground */ },
  }),
  ghost: StyleSheet.create({
    container: { backgroundColor: 'transparent' },
    text: { color: '#1f2937' },
  }),
  link: StyleSheet.create({
    container: { backgroundColor: 'transparent' },
    text: { color: '#16a34a', textDecorationLine: 'underline' },
  }),
};

// Size Styles
const sizeStyles = {
  default: StyleSheet.create({
    container: { height: 40, paddingHorizontal: 16, paddingVertical: 8 },
    text: { fontSize: 14 },
  }),
  sm: StyleSheet.create({
    container: { height: 36, paddingHorizontal: 12 },
    text: { fontSize: 12 },
  }),
  lg: StyleSheet.create({
    container: { height: 44, paddingHorizontal: 24 },
    text: { fontSize: 16 },
  }),
  icon: StyleSheet.create({
    container: { height: 40, width: 40 },
    text: {}, // Icon size is determined by the icon component itself
  }),
};

export { Button };
