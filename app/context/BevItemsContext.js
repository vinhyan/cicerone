import React, { createContext, useEffect, useState } from 'react';

export const BevItemsContext = createContext();

export default function BevItemsContextProvider({ children }) {
  const [bevItems, setBevItems] = useState([]);
  const [favItems, setFavItems] = useState([]);

  // const dbAPI =
  //   'https://cicerone-3e869-default-rtdb.europe-west1.firebasedatabase.app';
  // async function getBeers() {
  //   const res = await fetch(`${dbAPI}/beverages.json`);
  //   const data = await res.json();
  //   const beverages = Object.keys(data).map((key) => {
  //     return { ...data[key], id: key };
  //   });
  //   //  setBeverages(beverages);
  //   setBevItems(beverages);
  // }

  // useEffect(() => {
  //   getBeers();
  //   console.log(bevItems);
  // }, []);
  return (
    <BevItemsContext.Provider
      value={{ bevItems, setBevItems, favItems, setFavItems }}
    >
      {children}
    </BevItemsContext.Provider>
  );
}
