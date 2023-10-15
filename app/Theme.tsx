import {
  StyleSheet,
  TextStyle,
  Dimensions,
  ViewStyle,
  ScaledSize,
} from "react-native";
import React, { FunctionComponent, ReactNode, createContext } from "react";
import white_menu from "./assets/menu_white.png";
import black_menu from "./assets/menu_black.png";
import { useState } from "react";
import { useEffect } from "react";

// helper function to clamp a value between a min and max
const clamp = (min: number, max: number, val: number) => {
  return Math.round(Math.min(Math.max(val, min), max));
};

// theme-independent basic layout styling
export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  justifyCenter: {
    justifyContent: "center",
  },
  alignCenter: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  reverseRow: {
    flexDirection: "row-reverse",
  },
  reverseColumn: {
    flexDirection: "column-reverse",
  },
  slim: {
    width: "100%",
    maxWidth: 1500,
    paddingHorizontal: 50,
  },
  fullWidth: {
    width: "100%",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
});

// the various theme options available
type ThemeName = "dark";
type DimensionNames = "width" | "height";

// the styling options provided by each theme
export type Theme = {
  name: ThemeName;
  text: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  subscript: TextStyle;
  buttonText: TextStyle;
  header: TextStyle;
  // these color strings are fed into our linear gradient background. if you want a solid background, just provide 1 color
  background: string[];
  linkBackground: string[];
  mediumSpace: number;
  mediumSmallSpace: number;
  smallSpace: number;
  screenAnimationY: number;
  screenAnimationSpeed: number;
  screenAnimationOutSpeed: number;
  largeSpace: number;
  linearGradient: Object;
  floatingText: TextStyle;
};

// various properties that most themes will have in common, mostly things like component sizing/spacing/positioning
const defaultTheme = (scale: number, smallerDimension: DimensionNames):Theme => ({
  name: "dark",
  text: {
    color: "#FFFFFF",
  },
  subscript: {
    fontSize: clamp(14, 16, 30 * scale),
    paddingTop: 10,
    color: "#AAAAAA",
  },
  background: ["#000000", "#000000", "#1a1a1a", "#3d3d3d"],
  linkBackground: ["#ffb0fb", "#19344d"],
  floatingText: {
    fontSize: clamp(20, 30, 45 * scale),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  header: {
    fontSize: clamp(45, 70, 100 * scale),
    fontWeight: "bold" as "bold",
  },
  body: {
    fontSize: clamp(30, 45, 75 * scale),
  },
  caption: {
    fontSize: clamp(20, 30, 45 * scale),
  },
  buttonText: {
    fontSize: clamp(14, 16, 30 * scale),
    paddingBottom: 2,
  },
  largeSpace: clamp(50, 100, 150 * scale),
  mediumSpace: clamp(25, 50, 75 * scale),
  mediumSmallSpace: clamp(17, 35, 55 * scale),
  smallSpace: clamp(8, 15, 25 * scale),
  screenAnimationY: clamp(150, 200, 300 * scale),
  screenAnimationSpeed: 850,
  screenAnimationOutSpeed: 250,
  linearGradient: {
    useAngle: true,
    angle: 135,
    angleCenter: { x: 0.5, y: 0.5 },
  },
});

// where our themes are defined
// these all accept a scale variable, which is used to scale the theme's styling to different screen sizes
// as such, they cannot be used without first providing scale
export const Themes: Record<
  ThemeName,
  (scale: number, smallerDimension: DimensionNames) => Theme
> = {
  dark: (scale, smallerDimension) => defaultTheme(scale, smallerDimension),
};

// the theme provider/context used to provide the theme to all components/screens
type ThemeProviderProps = {
  children: ReactNode;
};

// set the initial context using the dark theme and starting window width
export const ThemeContext = createContext<Theme>(
  Themes["dark"](Dimensions.get("window").width / 1984, "width")
);

// setup context for changing the theme
const DEFAULT_VAL_FOR_TS = (
  // this is simply an empty theme state setter
  setter:
    | ((scale: number, smallerDimension: DimensionNames) => Theme)
    | (() => (scale: number, smallerDimension: DimensionNames) => Theme)
) => {};
export const SetThemeContext = React.createContext(DEFAULT_VAL_FOR_TS);

export const ThemeProvider: FunctionComponent<ThemeProviderProps> = ({
  children,
}) => {
  // scaling operations for different screen sizes
  // we normalize around 1984 and 1003 because those are my monitor's dimensions :P
  const window = Dimensions.get("window");
  const getThemeVariables = (window: ScaledSize) => {
    const height = Math.pow(window.height / 1003, 1.2);
    const width = window.width / 1984;
    const scale = Math.min(height, width);
    const smallerDimension: DimensionNames =
      height < width ? "height" : "width";
    return {
      scale,
      smallerDimension,
    };
  };
  const themeVariables = getThemeVariables(window);
  const [scale, setScale] = useState(themeVariables.scale);
  const [smallerDimension, setSmallerDimension] = useState<DimensionNames>(
    themeVariables.smallerDimension
  );

  // we handle the current theme state here so that we can also change it from any component via SetThemeContext
  const [curTheme, setCurTheme] = useState<
    (scale: number, smallerDimension: DimensionNames) => Theme
  >(() => Themes["dark"]);

  // when the size of the window changes, update our scaling
  useEffect(() => {
    const unsub = Dimensions.addEventListener("change", ({ window }: any) => {
      const themeVariables = getThemeVariables(window);
      setScale(themeVariables.scale);
      setSmallerDimension(themeVariables.smallerDimension);
    });
    return unsub.remove;
  }, []);

  return (
    <SetThemeContext.Provider value={setCurTheme}>
      <ThemeContext.Provider value={curTheme(scale, smallerDimension)}>
        {children}
      </ThemeContext.Provider>
    </SetThemeContext.Provider>
  );
};
