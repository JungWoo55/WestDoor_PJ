
import React from 'react';
import {
  TextInput,
  StyleSheet,
  type TextInputProps,
} from 'react-native';

// The original component is a styled <input>. 
// We will create a styled TextInput that forwards props.

const Input = React.forwardRef<TextInput, TextInputProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.input, style]}
        placeholderTextColor="#9ca3af" // Corresponds to placeholder:text-muted-foreground
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

const styles = StyleSheet.create({
  input: {
    height: 40, // h-9 is 36px, but 40 is a common mobile height
    width: '100%',
    minWidth: 0,
    borderRadius: 8, // rounded-md
    borderWidth: 1,
    borderColor: '#d1d5db', // border-input
    paddingHorizontal: 12, // px-3
    paddingVertical: 8, // py-1
    fontSize: 14, // md:text-sm
    backgroundColor: '#f9fafb', // A light background for input
    color: '#111827',
  },
});

export { Input };
