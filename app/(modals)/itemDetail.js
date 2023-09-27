
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UUIDGenerator from "react-native-uuid";
import { TouchableHighlight } from "react-native-gesture-handler";

export default function ItemDetail() {
  const params = useLocalSearchParams();
  const [displayItem, setDisplayItem] = useState({});
  const [image, setImage] = useState(null);
  const [favItems, setFavItems] = useState([]);
  const [isPressedHistory, setIsPressedHistory] = useState(false);
  const router = useRouter();

  const [isFavourite, setIsFavourite] = useState(false);

  const dbAPI =
    'https://cicerone-3e869-default-rtdb.europe-west1.firebasedatabase.app';

  async function getBeerImg() {
    const res = await fetch(`${dbAPI}/images/beer-images/${params.id}.json`);
    const data = await res.json();
    setImage(data);
    // console.log(data);
  }

  async function getBevItem() {
    const res = await fetch(`${dbAPI}/beverages/${params.id}.json`);
    const data = await res.json();
    setDisplayItem({ ...data, id: params.id });
  }

  useEffect(() => {
    getBevItem().then(getBeerImg()).then(checkFavItems());
  }, []);

  useEffect(() => {
    const storeFavItems = async () => {
      try {
        await AsyncStorage.setItem('favItems', JSON.stringify(favItems));
      } catch (err) {
        console.log(err);
      }
    };
    storeFavItems();
  }, [favItems]);

  const checkFavItems = async () => {
    try {
      let newFavItems = await AsyncStorage.getItem('favItems');
      console.log('fetched from async storage:', newFavItems);
      if (newFavItems !== null) {
        (newFavItems = JSON.parse(newFavItems)),
          console.log('favItems:', favItems);
        setFavItems(newFavItems);
      }
      if (newFavItems.find((item) => item.id === params.id)) {
        setIsFavourite(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFav = () => {
    if (favItems.find((item) => item.id === params.id)) {
      setIsFavourite(false);
      const newFavItems = favItems.filter((item) => item.id !== params.id);
      setFavItems(newFavItems);
    } else {
      setIsFavourite(true);
      const newFavItems = [...favItems, displayItem];
      setFavItems(newFavItems);
    }
  };

  const addBeverageToHistory = () => {
    const newHistory = {
      beverage: displayItem,
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
      router.back();
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'View Detail',
          headerTitleAlign: 'center',
        }}
      />
      <Image style={styles.image} source={{ uri: image }} />
      <Text style={styles.title}>{displayItem.name}</Text>
      <View style={styles.descContainer}>
        <View style={styles.desc}>
          <Text style={styles.beerDesc}>{displayItem.description}</Text>
          <Text style={styles.beerSubDesc}>Volume: {displayItem.volume}cl</Text>
          <Text style={styles.beerSubDesc}>
            Alcohol: {displayItem.alcohol}%
          </Text>
        </View>
        <TouchableOpacity onPress={handleFav}>
          <Ionicons
            name={isFavourite ? 'heart' : 'heart-outline'}
            size={40}
            color="#eb5151"
          />
        </TouchableOpacity>
      </View>
      <TouchableHighlight
        style={{
          backgroundColor: "#14213D",
          padding: 10,
          borderRadius: 10,
          margin: 10,
        }}
        onHideUnderlay={() => setIsPressedHistory(false)}
        onShowUnderlay={() => setIsPressedHistory(true)}
        onPress={addBeverageToHistory}
      >
        <Text
          style={{
            color: isPressedHistory ? "#FCA311" : "#FFF",
            textAlign: "center",
            fontSize: 20,
          }}
        >
          Add to history
        </Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    padding: 30,
  },
  descContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 20,
  },
  beerDesc: {
    fontSize: 20,
    padding: 10,
  },
  beerSubDesc: {
    fontSize: 15,
    padding: 10,
  },
});
