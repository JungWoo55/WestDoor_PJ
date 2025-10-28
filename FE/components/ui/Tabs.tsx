
import React, { useState, createContext, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, type ViewProps, type TouchableOpacityProps, type TextProps } from 'react-native';

// 1. Create the context
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// 2. Create the main Tabs component (Provider)
interface TabsProps extends ViewProps {
  defaultValue: string;
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, children, style }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <View style={style}>{children}</View>
    </TabsContext.Provider>
  );
};

// 3. Create the TabsList component
const TabsList: React.FC<ViewProps> = ({ children, style }) => {
  return <View style={[styles.listContainer, style]}>{children}</View>;
};

// 4. Create the TabsTrigger component
interface TabsTriggerProps extends TouchableOpacityProps {
  value: string;
  children: React.ReactNode;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, style, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <TouchableOpacity
      style={[
        styles.triggerContainer,
        isActive && styles.triggerActive,
        style,
      ]}
      onPress={() => setActiveTab(value)}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.triggerText, isActive && styles.triggerTextActive]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

// 5. Create the TabsContent component
interface TabsContentProps extends ViewProps {
  value: string;
}

const TabsContent: React.FC<TabsContentProps> = ({ value, children, style }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  const { activeTab } = context;

  if (activeTab !== value) {
    return null;
  }

  return <View style={style}>{children}</View>;
};

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6', // muted
    borderRadius: 12,
    padding: 4,
  },
  triggerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  triggerActive: {
    backgroundColor: '#ffffff', // card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280', // muted-foreground
  },
  triggerTextActive: {
    color: '#111827', // foreground
  },
});

export { Tabs, TabsList, TabsTrigger, TabsContent };
