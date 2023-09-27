import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Platform, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import UUIDGenerator from "react-native-uuid";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const endpoint =
  "https://cicerone-3e869-default-rtdb.europe-west1.firebasedatabase.app";

export default function BeerModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [historyItem, setHistoryItem] = useState({
    beverage: {
      name: "",
      description: "",
      imageID: "",
      volume: 0,
      alcohol: 0,
    },
    startTime: 0,
    endTime: 0,
    id: "",
  });
  const [image, setImage] = useState(null);
  const [alcohol, setAlcohol] = useState(0);
  const [volume, setVolume] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  useEffect(() => {
    const initHistoryItem = async () => {
      if (params.id === "custom-beer") {
        setHistoryItem({
          beverage: {
            name: "Custom beer",
            description: "This is a custom beer made by the user.",
            imageID: "custom-beer",
            volume: 0,
            alcohol: 0,
          },
          startTime: Date.now(),
          endTime: Date.now() + 1800000,
          id: UUIDGenerator.v4(),
        });
      } else {
        const response = await AsyncStorage.getItem("history");
        const history = JSON.parse(response);
        setHistoryItem(history.find((item) => item.id === params.id));
        console.log(history);
      }
    };

    initHistoryItem();
  }, []);

  useEffect(() => {
    const loadImage = async () => {
      const imageID = historyItem.beverage.imageID;
      const response = await fetch(
        `${endpoint}/images/beer-images/${imageID}.json`
      );
      const data = await response.json();
      if (response.ok) {
        setImage(data);
      }
    };

    loadImage();

    setAlcohol(historyItem.beverage.alcohol);
    setVolume(historyItem.beverage.volume);
    setStartTime(historyItem.startTime);
    setEndTime(historyItem.endTime);
  }, [historyItem]);

  const handleSave = async () => {
    if (startTime > endTime) {
      Alert.alert("Error", "Start time cannot be after end time.");
      setStartTime(historyItem.startTime);
      setEndTime(historyItem.endTime);
      return;
    }

    const newHistory = {
      beverage: {
        name: historyItem.beverage.name,
        description: historyItem.beverage.description,
        imageID: historyItem.beverage.imageID,
        volume: parseInt(volume),
        alcohol: parseFloat(alcohol.toString().replace(",", ".")),
      },
      startTime: startTime,
      endTime: endTime,
      id: historyItem.id,
    };

    // replace the old history item with the new one
    let oldHistory = await AsyncStorage.getItem("history");
    if (oldHistory === null) {
      oldHistory = [];
    } else {
      oldHistory = JSON.parse(oldHistory);
    }
    try {
      oldHistory = oldHistory.filter((item) => item.id !== params.id);
      const jsonValue = JSON.stringify([...oldHistory, newHistory]);
      await AsyncStorage.setItem("history", jsonValue).then(() => {
        router.back();
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title:
            params.id === "custom-beer" ? "Add new beer" : "Edit beer history",
          headerTitleAlign: "center",
          headerRight: () => {
            if (Platform.OS === "ios") {
              return (
                <Button
                  title={params.id === "custom-beer" ? "Add" : "Save"}
                  color={Platform.OS === "ios" ? "#fff" : "#FCA311"}
                  onPress={handleSave}
                />
              );
            } else if (Platform.OS === "web" || Platform.OS === "android") {
              return (
                <Pressable
                  onPress={handleSave}
                  style={{
                    padding: 10,
                    borderRadius: 5,
                    margin: 10,
                    alignSelf: "flex-end",
                    font: "400 18px system-ui",
                  }}
                >
                  {Platform.OS === "web" ? (
                    params.id === "custom-beer" ? (
                      "Add"
                    ) : (
                      "Save"
                    )
                  ) : (
                    <Text
                      style={{
                        color: "#FCA311",
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      Save
                    </Text>
                  )}
                </Pressable>
              );
            }
          },
        }}
      />
      <Image
        source={
          historyItem?.beverage?.imageID === "custom-beer"
            ? require("../assets/beer-images/empty-beer.png")
            : { uri: image ? image : null }
        }
        style={{
          width: 150,
          height: 150,
          resizeMode: "contain",
          alignSelf: "center",
        }}
      />
      <Text style={styles.title}>{historyItem?.beverage.name}</Text>
      <Text>{historyItem?.beverage.description}</Text>
      <ScrollView style={styles.body}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Alcohol %</Text>
          <TextInput
            value={alcohol.toString()}
            onChangeText={(text) => setAlcohol(text)}
            inputMode="decimal"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Volume (cl)</Text>
          <TextInput
            value={volume.toString()}
            onChangeText={(text) => setVolume(text)}
            inputMode="numeric"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Start time</Text>
          <DateTimePicker
            value={new Date(startTime)}
            onChange={(event, selectedDate) => {
              setStartTime(selectedDate.getTime());
            }}
            mode="datetime"
            display={Platform.OS === "android" ? "spinner" : "default"}
            style={{
              width: 190,
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>End time</Text>
          <DateTimePicker
            value={new Date(endTime)}
            onChange={(event, selectedDate) => {
              setEndTime(selectedDate.getTime());
            }}
            mode="datetime"
            display={Platform.OS === "android" ? "spinner" : "default"}
            style={{
              width: 190,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    backgroundColor: "#D3D3D3",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  inputText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 20,
  },
});
