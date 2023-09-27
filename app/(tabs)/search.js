import { useCallback, useEffect, useState, useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ResultItem from '../components/ResultItem';
import SwipeableFlatList from 'react-native-swipeable-list';

export default function Search() {
  const [keyword, setKeyword] = useState('');
  const [beverages, setBeverages] = useState([]);
  const [filteredBev, setFilteredBev] = useState([]);

  // console.log(`[DEBUG]`);
  // console.log(bevItems);

  //COMMENTED OUT FOR NOW

  const dbAPI =
    'https://cicerone-3e869-default-rtdb.europe-west1.firebasedatabase.app';

  //Fetch beverages from database
  async function getBeers() {
    const res = await fetch(`${dbAPI}/beverages.json`);
    const data = await res.json();
    const beverages = Object.keys(data).map((key) => {
      return { ...data[key], id: key };
    });
    setBeverages(beverages);
    // setBevItems(beverages);
  }

  useEffect(() => {
    getBeers();
  }, []);

  //************************* */

  // useFocusEffect(
  //   useCallback(() => {
  //     setFavItem(favItem);
  //   })
  // );

  //COMMENTED OUT FOR NOW

  // Search function: filter beverages every time keyword entered or the fetched beverages list changes
  useEffect(() => {
    const filteredBev = beverages.filter((bev) => bev.name.includes(keyword));
    setFilteredBev(filteredBev);
  }, [beverages, keyword]);

  //************************* */

  useEffect(() => {
    const filteredBev = beverages.filter((bev) => bev.name.includes(keyword));
    setFilteredBev(filteredBev);
  }, [beverages, keyword]);

  function removeSearch() {
    setKeyword('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Looking for your favourite beer?"
        />

        {keyword === '' ? (
          <Ionicons name="search" size={20} />
        ) : (
          <Pressable onPress={removeSearch}>
            <Ionicons name="close" size={20} />
          </Pressable>
        )}
      </View>
      <SwipeableFlatList
        data={filteredBev}
        renderItem={({ item }) => (
          <ResultItem
            beverage={item}
            href={{ pathname: 'itemDetail', params: { id: item.id } }}
          />
        )}
        keyExtractor={(item) => item.id}
        style={styles.resultContainer}
        maxSwipeDistance={80}
        disableLeftSwipe={true}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 0.5,
              backgroundColor: '#aaaa',
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  searchBar: {
    width: '100%',
    height: 40,
    backgroundColor: '#e9e9e9',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    gap: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    // outlineStyle: 'none',
  },
  resultContainer: {
    marginTop: 30,
  },
  action: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
