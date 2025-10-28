
import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';

// The original component used `cn` for conditional styling. 
// In React Native, we pass style props and merge them.
interface CardProps extends ViewProps {
  children: React.ReactNode;
}

const Card = React.forwardRef<View, CardProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.card, style]} {...props} />
));
Card.displayName = 'Card';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff', // Corresponds to bg-card
    borderRadius: 12, // Corresponds to rounded-xl
    borderWidth: 1,
    borderColor: '#e5e7eb', // Corresponds to border
    // Adding a subtle shadow for elevation, common in mobile UI
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export { Card };
