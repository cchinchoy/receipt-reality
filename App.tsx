import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  NewReceipt: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipt Reality</Text>
      <Text style={styles.subtitle}>
        See what your money actually costs you.
      </Text>
      <Pressable
        style={styles.primaryBtn}
        onPress={() => navigation.navigate("NewReceipt")}
      >
        <Text style={styles.primaryBtnText}>Create a Receipt</Text>
      </Pressable>
    </View>
  );
}

function NewReceiptScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Receipt</Text>
      <Text style={styles.subtitle}>
        Next: add items (name + price), live subtotal, then generate the
        results.
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Receipt Reality" }}
        />
        <Stack.Screen
          name="NewReceipt"
          component={NewReceiptScreen}
          options={{ title: "New Receipt" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    gap: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.8,
  },
  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    marginTop: 10,
  },
  primaryBtnText: {
    fontSize: 18,
    fontWeight: "600",
  },
  note: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.8,
  },
});
