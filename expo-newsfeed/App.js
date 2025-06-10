import React, { useState, useCallback } from 'react';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SignInWithOAuth } from '@clerk/clerk-expo';

const CLERK_PUBLISHABLE_KEY = 'pk_test_YOUR_KEY_HERE'; // TODO: replace with real key

const tokenCache = {
  getToken: (key) => SecureStore.getItemAsync(key),
  saveToken: (key, value) => SecureStore.setItemAsync(key, value),
};

const categories = ['Technology', 'Finance', 'Science', 'Sports'];

function LoginScreen() {
  return (
    <SafeAreaView style={styles.centered}>
      {/* Google OAuth sign in only */}
      <SignInWithOAuth strategy="oauth_google" redirectUrl="/" />
    </SafeAreaView>
  );
}

function FeedCard({ index }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Placeholder News Item #{index + 1}</Text>
      <Text style={styles.cardSubtitle}>This is static placeholder text.</Text>
    </View>
  );
}

function HomeScreen() {
  const [data, setData] = useState(Array.from({ length: 30 }, (_, i) => i));
  const [categoryIndex, setCategoryIndex] = useState(0);

  const loadMore = useCallback(() => {
    setData((prev) => [...prev, ...Array.from({ length: 20 }, (_, i) => prev.length + i)]);
  }, []);

  const renderItem = ({ item }) => <FeedCard index={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabsContainer}>
        {categories.map((c, i) => (
          <TouchableOpacity key={c} onPress={() => setCategoryIndex(i)} style={[styles.tab, categoryIndex === i && styles.activeTab]}> 
            <Text style={categoryIndex === i ? styles.activeTabText : styles.tabText}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

function AuthedApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <SignedIn>
        <AuthedApp />
      </SignedIn>
      <SignedOut>
        <LoginScreen />
      </SignedOut>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  tab: {
    padding: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  card: {
    margin: 10,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});
