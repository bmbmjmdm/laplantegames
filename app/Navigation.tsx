import React, { FunctionComponent, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "./Screens";
// @ts-ignore-next-line
import LinearGradient from "react-native-linear-gradient";

const Stack = createStackNavigator();

// the base app component wraps the app in our theme provider and fully expands to screen size
const App: FunctionComponent<{}> = () => {
  return (
    <Navigator />
  );
};

// Here is where all of our screens and paths are defined in a central naviator
// We also define our background color here
const Navigator: FunctionComponent<{}> = () => {
  // make navigation very plain (no header, theme, etc)
  const screenOptions = {
    headerShown: false,

  }
  const emptyTheme = {
    dark: false,
    colors: {
      background: "transparent",
      primary: "",
      card: "",
      text: "",
      border: "",
      notification: "",
    },
  };
  // setup linking to allow the url path to be used to navigate, as well as the back button
  const config = {
    screens: {
      Home: "home",
    },
  };
  const linking = { config, prefixes: [] };
  
  return (
    <LinearGradient
      //colors={["#000000", "#000000", "#1a1a1a", "#3d3d3d"]}
      //colors={["#000000", "#000000", "#aaaaaa", "#000000", "#000000"]}
      colors={["#000000", "#000000", "#000000", "#000000"]}
      style={{ height: "100%", overflow: "hidden" }}
      useAngle={true}
      angle={135}
      angleCenter={{ x: 0.5, y: 0.5 }}
    >
      <NavigationContainer theme={emptyTheme} linking={linking}>
        <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LinearGradient>
  );
};
export default App;
