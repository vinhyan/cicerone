import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { useEffect, useState, useRef, useCallback } from "react";
import SwipeableBeverage from "../components/SwipeableBeverage";
import AlcoholPercentage from "../components/intoxication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

const endpoint =
  "https://cicerone-3e869-default-rtdb.europe-west1.firebasedatabase.app";

export default function Home() {
  const [favorites, setFavorites] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(null);
  const list = useRef();

  const getFavorites = async () => {
    const customBeer = {
      name: "Custom beer",
      description: "description",
      imageID: "custom-beer",
      alcoholPercentage: 0,
      id: "custom-beer",
    };

    const loadedFavorites = await AsyncStorage.getItem("favItems");
    console.log("loadedFavorites", loadedFavorites);
    if (loadedFavorites !== null) {
      setFavorites([customBeer, ...JSON.parse(loadedFavorites)]);
    } else {
      setFavorites([customBeer]);
    }
  };

  useEffect(() => {
    getFavorites();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getFavorites();
    }, [])
  );

  useEffect(() => {
    if (favorites.length > 1) {
      list.current.scrollToIndex({ index: 1, animated: false });
      setScrollIndex(1);
    }
  }, [favorites]);

  return (
    <View style={styles.container}>
      <Text
        style={{
          textAlign: "center",
          margin: 10,
          fontStyle: "italic",
        }}
      >
        Swipe for more beers!
      </Text>
      <FlatList
        ref={list}
        horizontal
        data={favorites}
        pagingEnabled
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SwipeableBeverage item={item} />}
        style={{ flexGrow: 0 }}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: Dimensions.get("window").width,
          offset: Dimensions.get("window").width * index,
          index,
        })}
        initialScrollIndex={scrollIndex}
      />
      <View>
        <AlcoholPercentage />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingTop: 10,
  },
  alcoholContainer: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  alcoholText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
});
