import React, { useState } from "react";
import keys from "./keys";
import { FlatList, StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { Input, Divider } from 'react-native-elements';


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
  const sunnyimage = './assets/favicon.png';
  var curImage = "";

  const checkFloat = (e) => {
    var str = e.target.value;
    console.log(e.target.value)
    if (!str.match(/^-?[0-9]*[.][0-9]+$/)) {
      alert("Value must be a float number");
      return -1;
    }
    return e.target.value;
  }

  const search = (e) => {
    console.log("HEj")
    if (e.key === "Enter") {
      if (checkFloat(e) != -1) {
        fetch(`${api.base}api/category/pmp3g/version/2/geotype/point/lon/${query}/lat/${query1}/data.json`)
          .then((res) => res.json())
          .then((result) => {
            setTime(result.approvedTime);
            setWeather(result.timeSeries);
          }).catch(error => {
            console.log(error)
            if (error == "TypeError: Failed to fetch") {
              alert('Network error, check connection')
            }
            if (error == "SyntaxError: Unexpected token R in JSON at position 0") {
              alert('Out of Bounds, check input values')
            }
          });
      }
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
      <Text>
        Första: {query}             Andra: {query1}         approvedTime: {time}
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
                  placehold = nameq.values
                }
                if (nameq.name == "t") {
                  return (
                    <Text>
                      {nameq.values} °C       
                      <Image
                        source={require(`./assets/${placehold}.png`)}
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
              backgroundColor: 'blue' ,
              marginTop: 10
          }} />
          </View>
        }>

      </FlatList>
    </View>
  );
}

export default App;