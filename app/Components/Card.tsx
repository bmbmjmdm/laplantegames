import { StyleSheet } from "react-native";
import React, { FunctionComponent, ReactElement, useImperativeHandle } from "react";
import { Flex } from "./Layout";
import { StyledText, Typewriter } from "./Text";
import { AnimatedPiece } from "./AnimatedPiece";
import { Spacer } from "./Spacer";
import LinearGradient from "react-native-linear-gradient";


// A rounded rectangle with various built-in animations, appearances, etc
// Currently assumes there's always 3 areas: a header for a suit/name, a center for a large name, and a footer for a suit/name
type CardProps = {
  name?: string;
  typed?: boolean;
  topSuit?: ReactElement;
  topName?: string;
  botSuit?: ReactElement;
  botName?: string;
};

export const Card: FunctionComponent<CardProps> = ({
  name,
  typed = false,
  topSuit,
  topName,
  botSuit,
  botName,
}) => {
  // TODO get the current page name from redux
  const curStyle = { ...styles.Home, ...nonStyles.Home }
  
  const changeName = (newName:string) => {
    // cards will make these animation functions available to our parent to use based on other effects interacting with this card, the callback for this cards onPress function, etc
    // when one is triggered, it run its animations directly on the card & subcomponents or called through AnimatedPiece
  }

  return (
    <AnimatedPiece
      animationComplete={() => {}}
      startingHeight={styles.Home.container.height}
      startingWidth={styles.Home.container.width}
    >
      <LinearGradient
        style={curStyle.container}
        {...curStyle.containerGradient}
      >
        <Flex flex={1} centered>
          <Flex row>
            {topSuit}
            {topSuit && topName && <Spacer width={10} />}
            {
              topName &&
                <StyledText type="caption" style={{ color: topSuit?.props.fill }}>
                  {topName}
              </StyledText>
            }
          </Flex>
        </Flex>
        <Flex flex={3} centered>
          <Typewriter startFull={!typed} centered>
            <StyledText type="body">{name}</StyledText>
          </Typewriter>
        </Flex>
        <Flex flex={1} centered>
          <Flex row>
            {botSuit}
            {botSuit && botName && <Spacer width={10} />}
            {
              topName &&
                <StyledText type="caption" style={{ color: botSuit?.props.fill }}>
                  {botName}
              </StyledText>
            }
          </Flex>
        </Flex>
        </LinearGradient>
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
    },
  })
}

const nonStyles = {
  Home: {
    containerGradient: {
      colors: ["#000000", "#000000", "#1a1a1a", "#3d3d3d"],
      useAngle: true,
      angle: 135,
      angleCenter: { x: 0.5, y: 0.5 },
    }
  }
}
