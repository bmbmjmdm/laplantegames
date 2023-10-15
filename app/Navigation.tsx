import React, { FunctionComponent, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeContext, ThemeProvider } from "./Theme";
import { HomeScreen } from "./Screens";
// @ts-ignore-next-line
import LinearGradient from "react-native-linear-gradient";

const Stack = createStackNavigator();

// the base app component wraps the app in our theme provider and fully expands to screen size
const App: FunctionComponent<{}> = () => {
  return (
    <ThemeProvider>
      <Navigator />
    </ThemeProvider>
  );
};

// Here is where all of our screens and paths are defined in a central naviator
// We also define our background color here
const Navigator: FunctionComponent<{}> = () => {
  const theme = useContext(ThemeContext);
  // we pass an empty theme to the navigation container because we prefer to use our theme context
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
  // setup our header on all screens
  const defaultOptions = {
    header: undefined,
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
      colors={theme.background}
      style={{ height: "100%", overflow: "hidden" }}
      {...theme.linearGradient}
    >
      <NavigationContainer theme={emptyTheme} linking={linking}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={defaultOptions}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LinearGradient>
  );
};

export default App;
