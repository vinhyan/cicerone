import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

export default function ResultItem({ beverage, href }) {
  const [image, setImage] = useState(null);

  const dbAPI =
    'https://cicerone-3e869-default-rtdb.europe-west1.firebasedatabase.app';

  async function getBeerImg() {
    const res = await fetch(`${dbAPI}/images/beer-images/${beverage.id}.json`);
    const data = await res.json();
    setImage(data);
    // console.log(data);
  }

  useEffect(() => {
    getBeerImg();
  }, []);
  //   console.log(image);

  return (
    <Link href={href} asChild>
      <TouchableHighlight>
        <View style={styles.result}>
          <Image style={styles.image} source={{ uri: image }} />
          <View>
            <Text style={styles.title}>{beverage.name}</Text>
          </View>
        </View>
      </TouchableHighlight>
    </Link>
  );
}

const styles = StyleSheet.create({
  result: {
    backgroundColor: '#fff',
    // marginBottom: 30,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
  },
  image: {
    height: 70,
    width: 70,
    resizeMode: 'contain',
  },
});
