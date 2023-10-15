import { StyleSheet } from "react-native";
import React, { FunctionComponent, ReactNode } from "react";
import { Flex } from "./Layout";
import { StyledText, Typewriter } from "./Text";


// A rounded rectangle with various built-in animations, appearances, etc
type CardProps = {
  name?: string;
  typed?: boolean;
};

const styles = {
  Home: StyleSheet.create({
    container: {
      height: 200,
      width: 150,
      borderColor: "#eeeeee",
      borderWidth: 1,
      borderRadius: 15,
      margin: 20,
    }
  })
}

export const Card: FunctionComponent<CardProps> = ({
  name,
  typed = false,
}) => {
  // TODO get the current page name from redux
  const curStyle = styles.Home
  return (
    <Flex
      style={curStyle.container}
      centered
    >
      {
        name && (
          <Typewriter startFull={!typed}>
            <StyledText type="body">{name}</StyledText>
          </Typewriter>
        )
      }
    </Flex>

  );
};
