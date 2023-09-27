import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserContext } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

const AlcoholPercentage = () => {
  const userInfos = useContext(UserContext).userInfo;

  const [history, setHistory] = useState([]);

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

  const [alcoholPercentage, setAlcoholPercentage] = useState(0);
  const [lastDrinkTime, setLastDrinkTime] = useState(Date.now());
  const previousAmount = [0];

  const calculateAlcoholPercentage = (beerQuantity, beerPercentage) => {
    const genderFactorAlcohol = userInfos.gender === "female" ? 0.66 : 0.73;
    const genderFactorBlood = userInfos.gender === "female" ? 0.065 : 0.075;

    const litersOfBlood = userInfos.weight * genderFactorBlood;
    const gramsOfAlcohol =
      (beerQuantity * beerPercentage * 0.789) /
      (genderFactorAlcohol * userInfos.weight);
    const alcoholInBlood = gramsOfAlcohol / litersOfBlood;

    if (previousAmount == [0]) {
      previousAmount == [alcoholInBlood];
      return alcoholInBlood.toFixed(2);
    } else {
      const totalAlcoholInBlood = alcoholInBlood + previousAmount[0];
      previousAmount[0] = totalAlcoholInBlood;
      return totalAlcoholInBlood.toFixed(2);
    }
  };

  useEffect(() => {
    const handleDrink = (beerQuantity, beerPercentage) => {
      const newAlcoholPercentage = calculateAlcoholPercentage(
        beerQuantity,
        beerPercentage
      );
      setAlcoholPercentage(newAlcoholPercentage);
      setLastDrinkTime(Date.now());
    };

    if (history.length > 0) {
      for (let b = 0; b < history.length; b++) {
        const beerQuantity = history[b].beverage.volume;
        const beerPercentage = history[b].beverage.alcohol;
        handleDrink(beerQuantity, beerPercentage);
      }
    } else {
      setAlcoholPercentage(0);
    }
  }, [history]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeElapsed = (Date.now() - lastDrinkTime) / 60000;
      const decreaseRate = 0.015;
      const newAlcoholPercentage =
        alcoholPercentage - timeElapsed * decreaseRate;

      if (newAlcoholPercentage > 0) {
        setAlcoholPercentage(newAlcoholPercentage.toFixed(2));
      } else if (history.length == 0) {
        setAlcoholPercentage(0);
      } else {
        setAlcoholPercentage(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [alcoholPercentage, lastDrinkTime]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alcohol Intoxication</Text>
      <Text style={styles.percentage}>{alcoholPercentage} g/L</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  percentage: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
});

export default AlcoholPercentage;
