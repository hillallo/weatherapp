import React, { useEffect, useState } from "react";
import keys from "./keyandimages";
import { FlatList, StyleSheet, Text, View, Dimensions, Image, TextInput, Button, SafeAreaView, KeyboardAvoidingViewComponent, AsyncStorage} from 'react-native';
import { Input, Divider } from 'react-native-elements';
import * as firebase from 'firebase';
import * as FileSystem from 'expo-file-system';
import keyandimages from "./keyandimages";
import NetInfo from "@react-native-community/netinfo";

const api = {
  base: keyandimages.BASE_URL,
};

//Database
var firebaseConfig = {
  apiKey: "AIzaSyDbhVNxocJUldPoHxyCvkHKozxn-X2C5TA",
  authDomain: "weatherapp-f56f9.firebaseapp.com",
  databaseURL: "https://weatherapp-f56f9.firebaseio.com",
  projectId: "weatherapp-f56f9",
  storageBucket: "weatherapp-f56f9.appspot.com",
  messagingSenderId: "50169328296",
  appId: "1:50169328296:web:75ba237235b71395d5489d",
  measurementId: "G-ME09PP722W"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
///////////////
function App() {

  const [query, setQuery] = useState("");
  const [query1, setQuery1] = useState("");
  const [weather, setWeather] = useState([]);
  const [time, setTime] = useState("");

  var weathers = [];
  var placehold;
  var test;


  const load = async () => {
    try {
      let name = JSON.parse(await AsyncStorage.getItem("myObj"));
      let time = JSON.parse(await AsyncStorage.getItem("myTime"))
      if(name.length > 5){
        setWeather(name)
        setTime(time)
      }
    } catch (err) {
      alert(err)
    }
  }

  const save = async () => {
    try {
      let weather_serialized = JSON.stringify(weather)
      let time_serialized = JSON.stringify(time);

      await AsyncStorage.setItem("myObj", weather_serialized)
      await AsyncStorage.setItem("myTime", time_serialized)

      console.log("Save", await AsyncStorage.getItem("myTime"))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    console.log(NetInfo.fetch().then((state) =>{
      console.log(state.isConnected)
      test = state.isConnected
      console.log(test)
    }));
    if (test === true) {
      firebase.database().ref("weather/weather").on('value', (snapshot) => {
        weathers = snapshot.val();
        setWeather(snapshot.val().timeSeries)
        setTime(snapshot.val().approvedTime);
      });
    } else {
      load()
    }
  }, []);

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
    if (checkFloat() != -1) {
      fetch(`${api.base}api/category/pmp3g/version/2/geotype/point/lon/${query}/lat/${query1}/data.json`)
        .then((res) => res.json())
        .then((result) => {
          setTime(result.approvedTime);
          setWeather(result.timeSeries);
          firebase
            .database()
            .ref('weather/weather')
            .set({
              weather: result
            });
        }).then(() => {
          save()
        })
        .catch(error => {
          console.log(error)
          alert(error)
        });
    }
  };

  return (
    <SafeAreaView>
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
          placeholder="Longitude"
          className="search-bar"
          onChangeText={(e) => setQuery(e)}
          value={query}
          returnKeyType="done"
          style={{
            marginTop: 10,
            borderWidth: 1,
            fontSize: 20
          }}

        />
        <TextInput
          type="text"
          placeholder="Latitude"
          onChangeText={(e) => setQuery1(e)}
          value={query1}
          returnKeyType="done"
          style={{
            borderWidth: 1,
            fontSize: 20
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
        Latitude: {query}
      </Text>
      <Text
        style={{
          fontWeight: 'bold'
        }}>
        Longitude: {query1}
      </Text>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 20
        }}>
        Time: {time}
      </Text>

      <FlatList
        data={weather}
        renderItem={({ item }) =>
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style=
              {{
                fontWeight: "bold",
                backgroundColor: 'green',
                width: Dimensions.get('window').width / 1.09,
                color: 'white',
                padding: 10,
                borderRadius: 10,
              }}>
              Time: {item.validTime}     Temperature: {item.parameters.map(nameq => {
                if (nameq.name == "tcc_mean") {
                  placehold = nameq.values[nameq.values.length - 1]
                }
                if (nameq.name == "t") {
                  return (
                    <Text>
                      {nameq.values} °C
                      <Image
                        source={keyandimages.images[placehold]}
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
    </SafeAreaView>
  );
}

export default App;