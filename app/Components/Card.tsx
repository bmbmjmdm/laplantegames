import { StyleSheet } from "react-native";
import React, { FunctionComponent, ReactNode, useImperativeHandle } from "react";
import { Flex } from "./Layout";
import { StyledText, Typewriter } from "./Text";
import { AnimatedPiece } from "./AnimatedPiece";


// A rounded rectangle with various built-in animations, appearances, etc
type CardProps = {
  name?: string;
  typed?: boolean;
};

export const Card: FunctionComponent<CardProps> = ({
  name,
  typed = false,
}) => {
  // TODO get the current page name from redux
  const curStyle = styles.Home

  const changeName = (newName:string) => {
    // cards will make these animation functions available to our parent to use based on other effects interacting with this card, the callback for this cards onPress function, etc
    // when one is triggered, it run its animations directly on the card & subcomponents or called through AnimatedPiece
  }

  return (
    <AnimatedPiece animationComplete={() => {}}>
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
    </AnimatedPiece>
  );
};


const styles = {
  Home: StyleSheet.create({
    container: {
      height: 200,
      width: 150,
      borderColor: "#eeeeee",
      borderWidth: 2,
      borderRadius: 25,
      margin: 20,
      padding: 20,
    }
  })
}
