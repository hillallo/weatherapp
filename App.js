import React, { useState } from "react";
import keys from "./keys";
import { FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Input, Divider, Image } from 'react-native-elements';


const api = {
  base: keys.BASE_URL,
};

function App() {
  const dateBuild = (d) => {
    let date = String(new window.Date());
    date = date.slice(3, 15);
    return date;
  };

  const [query, setQuery] = useState("");
  const [query1, setQuery1] = useState("");
  const [weather, setWeather] = useState([]);
  var weathers = [];
  var test = [];

  const search = (e) => {
    console.log("HEj")
    if (e.key === "Enter") {
      fetch(`${api.base}api/category/pmp3g/version/2/geotype/point/lon/${query}/lat/${query1}/data.json`)
        .then((res) => res.json())
        .then((result) => {
          setQuery("");
          setWeather(result.timeSeries);
          console.log(result.timeSeries);
        });
    }
  };

  return (
    <View>
      <View className="search-container">
        <Input
          type="text"
          placeholder="Search... click"
          className="search-bar"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          onKeyPress={search}
        />
        <Input
          type="text"
          placeholder="longitude"
          onChange={(e) => setQuery1(e.target.value)}
          value={query1}
          onKeyPress={search}
        >
        </Input>
      </View>
      {weather.map(name => {
        name.parameters.map(name1 => {
          if (name1.name == "t") {
            weathers.push(name1.values)
            console.log("Pushed: ", name1.values)
          }
        })
      })}
      <FlatList
        data={weather}
        renderItem={({ item }) =>

          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style=
              {{
                fontWeight: "bold",
                backgroundColor: 'green',
                width: Dimensions.get('window').width,
                color: 'white',
                padding: 10,
                borderRadius: 10
              }}>
              Time: {item.validTime}     Temperature: {item.parameters.map(nameq => {
                if (nameq.name == "t") {
                  return (
                    <Text>
                      {nameq.values}
                    </Text>
                  )
                }
              })} °C
            </Text>
            <Image
              source={{
                uri: image,
              }}>
            </Image>
            <Divider style={{ backgroundColor: 'blue' }} />
          </View>


        }>

      </FlatList>
    </View>
  );
}

export default App;