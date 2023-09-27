import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableHighlight } from "react-native";
import { Link } from "expo-router";
import { useState, useEffect } from "react";

const endpoint =
  "https://cicerone-3e869-default-rtdb.europe-west1.firebasedatabase.app";

export default function BeverageDetail({ historyItem, href }) {
  const [image, setImage] = useState(null);

  const loadImage = async () => {
    const response = await fetch(
      `${endpoint}/images/beer-images/${historyItem.beverage.imageID}.json`
    );
    const data = await response.json();
    if (response.ok) {
      setImage(data);
    }
  };

  useEffect(() => {
    loadImage();
  }, []);

  const startTimeConverted = new Date(historyItem.startTime)
    .toLocaleTimeString({
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(/(.\d{2}| [AP]M)$/, "")
    .replace(/\./g, ":");
  const endTimeConverted = new Date(historyItem.endTime)
    .toLocaleTimeString({
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(/(.\d{2}| [AP]M)$/, "")
    .replace(/\./g, ":");

  return (
    <View>
      <Link href={href} asChild>
        <TouchableHighlight>
          <View style={styles.container}>
            <Image
              source={
                historyItem.beverage.imageID === "custom-beer"
                  ? require("../assets/beer-images/empty-beer.png")
                  : { uri: image }
              }
              style={{
                width: 75,
                height: 75,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
            <View style={styles.textContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                {historyItem.beverage.name}
              </Text>
              <Text style={styles.text}>
                {historyItem.beverage.alcohol}%, {historyItem.beverage.volume}{" "}
                cl
              </Text>
              <Text style={styles.text}>
                {startTimeConverted} - {endTimeConverted}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 10,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  text: {
    fontSize: 18,
  },
});
