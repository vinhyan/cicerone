import { useEffect, useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import UUIDGenerator from "react-native-uuid";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const endpoint =
  "https://cicerone-3e869-default-rtdb.europe-west1.firebasedatabase.app";

export default function SwipeableBeverage({ item }) {
  const [image, setImage] = useState(null);

  const IMG_WIDTH = Dimensions.get("window").width * 0.5;
  const IMG_HEIGHT = IMG_WIDTH;

  useEffect(() => {
    const loadImage = async () => {
      const response = await fetch(
        `${endpoint}/images/beer-images/${item.imageID}.json`
      );
      const data = await response.json();
      if (response.ok) {
        setImage(data);
      }
    };

    if (item.id !== "custom-beer") {
      loadImage();
    }
  }, []);

  const addBeverageToHistory = () => {
    const newHistory = {
      beverage: item,
      startTime: Date.now(),
      endTime: Date.now() + 1800000, // 30 minutes
      id: UUIDGenerator.v4(),
    };

    const saveHistory = async () => {
      let oldHistory = await AsyncStorage.getItem("history");
      if (oldHistory === null) {
        oldHistory = [];
      } else {
        oldHistory = JSON.parse(oldHistory);
      }
      try {
        const jsonValue = JSON.stringify([...oldHistory, newHistory]);
        await AsyncStorage.setItem("history", jsonValue);
      } catch (e) {
        console.log(e);
      }
    };

    saveHistory().then(() => {
      console.log("History saved");
      // console.log("Fetching new history...");
      // const logHistory = async () => {
      //   const history = await AsyncStorage.getItem("history");
      //   if (history !== null) {
      //     console.log(JSON.parse(history));
      //   }
      // };
      // logHistory();
    });
  };

  if (item.id === "custom-beer") {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            paddingBottom: 10,
          }}
        >
          {item.name}
        </Text>
        <Link
          href={{
            pathname: "beer-modal",
            params: {
              id: item.id,
            },
          }}
          asChild
        >
          <TouchableOpacity>
            <Image
              source={require("../assets/beer-images/empty-beer.png")}
              style={{
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                resizeMode: "cover",
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        </Link>
      </View>
    );
  } else {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            paddingBottom: 10,
          }}
        >
          {item.name}
        </Text>
        <TouchableOpacity onPress={addBeverageToHistory}>
          <Image
            source={{ uri: image }}
            style={{
              width: IMG_WIDTH,
              height: IMG_HEIGHT,
              resizeMode: "cover",
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
