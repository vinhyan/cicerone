import { Text, View, StyleSheet, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import SwipeableFlatList from "react-native-swipeable-list";
import BeverageDetail from "../components/BeverageDetail";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActionButton from "react-native-action-button";

export default function History() {
  const [history, setHistory] = useState();

  const loadHistory = async () => {
    const history = await AsyncStorage.getItem("history");
    if (history !== null) {
      setHistory(JSON.parse(history));
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const clearHistory = async () => {
    const clearHistoryAsync = async () => {
      try {
        await AsyncStorage.removeItem("history");
        setHistory([]);
      } catch (e) {
        console.log(e);
      }
    };

    Alert.alert(
      "Clear History",
      "Are you sure you want to clear your history?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Clear",
          onPress: () => clearHistoryAsync(),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    <BeverageDetail
      historyItem={item}
      href={{ pathname: "beer-modal", params: { id: item.id } }}
    />
  );

  const handleDelete = async (id) => {
    const newHistory = history.filter((item) => item.id !== id);
    await AsyncStorage.setItem("history", JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          display: history && history.length > 0 ? "none" : "flex",
          textAlign: "center",
          marginTop: 20,
          fontSize: 20,
        }}
      >
        Nothing to show here...
      </Text>
      <Text
        style={{
          display: history && history.length > 0 ? "none" : "flex",
          textAlign: "center",
          marginTop: 20,
          fontSize: 80,
        }}
      >
        🕸️
      </Text>
      <SwipeableFlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        maxSwipeDistance={80}
        renderQuickActions={({ index, item }) => {
          return (
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons
                  name="trash"
                  size={40}
                  color="#fff"
                  style={styles.action}
                />
              </TouchableOpacity>
            </View>
          );
        }}
        disableLeftSwipe={true}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 0.5,
              backgroundColor: "#aaa",
            }}
          />
        )}
      />
      <ActionButton
        buttonColor="rgba(231,76,60,1)"
        renderIcon={() => <Ionicons name="trash" size={25} color="#fff" />}
        onPress={() => clearHistory()}
      ></ActionButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  actions: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#f76a43",
  },
  action: {
    padding: 20,
    alignSelf: "center",
  },
  filler: {
    size: 100,
    backgroundColor: "#fff",
  },
  clearButton: {
    backgroundColor: "#f76a43",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
});
