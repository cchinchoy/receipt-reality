import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//======================
// New Data Model type
//======================

type ReceiptItem = {
  id: string;
  name: string;
  price: string; // Store as string for easier TextInput handling
};

//========================================
// CHANGED: Added Result route with params
//========================================
type RootStackParamList = {
  Home: undefined;
  NewReceipt: undefined;
  Result: { items: ReceiptItem[]; subtotal: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

//======================
// Day 2 - New
//======================
function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

//======================
// Day 2 - New
//======================
function parseMoney(input: string): number {
  const cleaned = input.replace(/[^\d.]/g, "");
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
}

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

//===================================================
// CHANGED: NewReceiptScreen is now a FORM
//===================================================

function NewReceiptScreen({ navigation }: any) {
  // NEW : state
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: makeId(), name: "", price: "" },
  ]);

  // NEW derived subtotal (computed from items)
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + parseMoney(item.price), 0);
  }, [items]);

  // NEW: add a new empty row
  function addItem() {
    setItems((prev) => [...prev, { id: makeId(), name: "", price: "" }]);
  }

  // NEW : update one field in one row(immutable update)
  function updateItem(id: string, field: "name" | "price", value: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)),
    );
  }

  // NEW: remove one row
  function removeItem(id: string) {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      return next.length > 0 ? next : [{ id: makeId(), name: "", price: "" }]; // Ensure at least one row
    });
  }

  // NEW: validate + navigate with data
  function generateReality() {
    const cleaned = items.filter(
      (it) => it.name.trim().length > 0 || it.price.trim().length > 0,
    );
    if (cleaned.length === 0) {
      Alert.alert("Please add at least one item with a name or price.");
      return;
    }

    const cleanedSubtotal = cleaned.reduce(
      (sum, it) => sum + parseMoney(it.price),
      0,
    );

    navigation.navigate("Result", {
      items: cleaned,
      subtotal: cleanedSubtotal,
    });
  }

  // NEW: how to render each row in the list
  function renderRow({ item }: { item: ReceiptItem }) {
    return (
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Item</Text>
          <TextInput
            value={item.name}
            onChangeText={(text) => updateItem(item.id, "name", text)}
            placeholder="e.g. Milk"
            style={styles.input}
          />
        </View>
        <View style={{ width: 120 }}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            value={item.price}
            onChangeText={(text) => updateItem(item.id, "price", text)}
            placeholder="12.50"
            keyboardType="decimal-pad"
            style={styles.input}
          />
        </View>
        <Pressable style={styles.deleteBtn} onPress={() => removeItem(item.id)}>
          <Text style={{ fontSize: 18 }}>🗑️</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>New Receipt</Text>
        <Text style={styles.subtitle}>
          Add items and prices. Subtotal updates automatically
        </Text>
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={renderRow}
          style={{ marginTop: 12 }}
        />
        <View style={styles.footer}>
          <Pressable style={styles.secondaryBtn} onPress={addItem}>
            <Text style={styles.secondaryBtnText}>+ Add Item</Text>
          </Pressable>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>SubTotal</Text>
            <Text style={styles.totalValue}>{subtotal.toFixed(2)}</Text>
          </View>
          <Pressable style={styles.primaryBtn} onPress={generateReality}>
            <Text style={styles.primaryBtnText}>Generate Reality</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

//===================================================
// CHANGED: New ResultScreen to show the reality data
//===================================================

function ResultScreen({ route, navigation }: any) {
  const { items, subtotal } = route.params as {
    items: ReceiptItem[];
    subtotal: number;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <Text style={styles.subtitle}></Text>
      <View style={{ marginTop: 12 }}>
        {items.map((it) => (
          <Text key={it.id}>
            {it.name || "(no name)"} - ${parseMoney(it.price).toFixed(2)}
          </Text>
        ))}
      </View>
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
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ title: "Your Reality" }}
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
  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  totalBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
  },
});
