import React, { useEffect, useState } from "react";
import keys from "./keys";
import { FlatList, StyleSheet, Text, View, Dimensions, Image, TextInput, Button } from 'react-native';
import { Input, Divider } from 'react-native-elements';
import * as firebase from 'firebase';
import * as FileSystem from 'expo-file-system';


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
  const [time, setTime] = useState("");

  var weathers = [];
  var test = [];
  var placehold;
  var curImage = "";


  const checkFloat = () => {
    var str1 = query
    var str2 = query1
    if (!str1.match(/^-?[0-9]*[.][0-9]+$/) || !str2.match(/^-?[0-9]*[.][0-9]+$/)) {
      alert("Value must be a float number");
      return -1;
    }
    return 1;
  }

  const search = () => {
    console.log("check float")
    if (checkFloat() != -1) {
      fetch(`${api.base}api/category/pmp3g/version/2/geotype/point/lon/${query}/lat/${query1}/data.json`)
        .then((res) => res.json())
        .then((result) => {
          setTime(result.approvedTime);
          setWeather(result.timeSeries);
        }).catch(error => {
          console.log(error)
          alert('Error')
        });
    }

  };

  return (
    <View>
      {weather.map(name => {
        name.parameters.map(name1 => {
          if (name1.name == "t") {
            weathers.push(name1.values)
          }
        })
      })}
      <View>
        <TextInput
          type="text"
          placeholder="Enter text here..."
          className="search-bar"
          onChangeText={(e) => setQuery(e)}
          value={query}
          returnKeyType="done"
          style={{
            marginTop: 40,
          }}

        />
        <TextInput
          type="text"
          placeholder="longitude"
          onChangeText={(e) => setQuery1(e)}
          value={query1}
          returnKeyType="done"
          style={{
            marginTop: 40,
            marginBottom: 20
          }}
        >
        </TextInput>
        <Button
          onPress={search}
          title="Submit"
          color="#841584"
        />

      </View>

      <Text
        style={{
          fontWeight: 'bold'
        }}>
        Första: {query}
      </Text>
      <Text
        style={{
          fontWeight: 'bold'
        }}>
        Longitude: {query1}
      </Text>
      <Text>
        approvedTime: {time}
      </Text>

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
                if (nameq.name == "tcc_mean") {
                  placehold = nameq.values[nameq.values.length - 1]
                  console.log(placehold)
                }
                if (nameq.name == "t") {
                  return (
                    <Text>
                      {nameq.values} °C
                      <Image
                        //source={require(`./assets/${placehold}.png`)}
                        style={{
                          height: 50,
                          width: 80
                        }}>
                      </Image>
                    </Text>
                  )
                }
              })}
            </Text>
            <Divider style={{
              backgroundColor: 'blue',
              marginTop: 10
            }} />
          </View>
        }>

      </FlatList>
    </View>
  );
}

export default App;