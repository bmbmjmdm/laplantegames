import { Text, TextStyle, Animated, StyleSheet, LayoutChangeEvent } from "react-native";
import React, {
  FunctionComponent,
  ReactNode,
} from "react";
import "react-native-get-random-values";

export type TextProps = {
  style?: TextStyle | Animated.AnimatedProps<TextStyle>;
  children?: ReactNode;
  onPress?: () => void;
  type?: "header" | "body" | "caption" | "subscript" | "button";
  animated?: boolean;
  centered?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
};

// Our basic text component that integrates with our theme
export const StyledText: FunctionComponent<TextProps> = (props) => {
  // TODO get the current page name from redux
  const curStyle = styles.Home

  // setup style
  const newProps = { ...props };
  const { style = {}, type, animated } = props;
  const centeredStyle:TextStyle = props.centered ? { textAlign: "center" } : {};
  let typeStyle = {}

  // use the given type to lookup that text type style in our theme
  if (type) {
    const fullType = type === "button" ? "buttonText" : type;
    typeStyle = curStyle[fullType]
  }

  newProps.style = { ...curStyle.text, ...typeStyle, ...centeredStyle, ...style };

  if (animated) return <Animated.Text {...newProps} />;
  // @ts-ignore-next-line - it doesn't know how to handle animated styles with the animated prop
  else return <Text {...newProps} />;
};


const styles = {
  Home: StyleSheet.create({
    text: {
      //color: "#4B296B",
      color: "#FFFFFF",
    },
    subscript: {
      fontSize: 14,
      paddingTop: 10,
      color: "#FFFFFF",
    },
    header: {
      fontSize: 45,
      fontWeight: "bold" as "bold",
    },
    body: {
      fontSize: 30,
    },
    caption: {
      fontSize: 20,
    },
    buttonText: {
      fontSize: 14,
      paddingBottom: 2,
    },
  })
}
