import { StyleSheet, TouchableOpacity } from "react-native";
import React, { FunctionComponent, ReactElement, useImperativeHandle, useRef } from "react";
import { Flex } from "./Layout";
import { StyledText, Typewriter } from "./Text";
import { AnimatedPiece, AnimatedPieceFunctions } from "./AnimatedPiece";
import { Spacer } from "./Spacer";
import LinearGradient from "react-native-linear-gradient";


// A rounded rectangle with various built-in animations, appearances, etc
// Currently assumes there's up to 3 areas: a large name taking the top 3/5ths, and a smaller bottom containing up to 2 suits/names
type CardProps = {
  name?: string;
  typed?: boolean;
  topSuit?: ReactElement;
  topName?: string;
  botSuit?: ReactElement;
  botName?: string;
  hasGradient?: boolean;
};

export const Card: FunctionComponent<CardProps> = ({
  name,
  typed = false,
  topSuit,
  topName,
  botSuit,
  botName,
  hasGradient = true,
}) => {
  const animationRef = useRef<AnimatedPieceFunctions>(null);

  // TODO get the current page name from redux
  const curStyle = { ...styles.Home, ...nonStyles.Home }

  // by default, a card has a gradient from top suit's color (or white) to the page's default color (usually black) to bottom suit's color (or white)
  // if gradient is turned off, it's just the page's default color (usually black)
  const gradient = hasGradient ?
    [
      topSuit?.props.fill || "#a1a1a1",
      curStyle.defaultGradient[0],
      curStyle.defaultGradient[0],
      curStyle.defaultGradient[0],
      curStyle.defaultGradient[0],
      botSuit?.props.fill || "#a1a1a1"
    ]
    : curStyle.defaultGradient
  
  const changeName = (newName:string) => {
    // cards will make these animation functions available to our parent to use based on other effects interacting with this card, the callback for this cards onPress function, etc
    // when one is triggered, it run its animations directly on the card & subcomponents or called through AnimatedPiece
  }

  return (
    <AnimatedPiece
      animationComplete={() => {}}
      startingHeight={styles.Home.container.height}
      startingWidth={styles.Home.container.width}
      ref={animationRef}
    >
      <TouchableOpacity onPress={() => {
        const rand = Math.random();
        if (rand > 0.66) {
          animationRef.current?.shake();
        }
        else if (rand > 0.33) {
          animationRef.current?.pace();
        }
        else {
          animationRef.current?.jump();
        }
      }}>
        <LinearGradient
          style={curStyle.container}
          colors={gradient}
          {...curStyle.containerGradient}
        >
          {name && (
            <Flex flex={3} centered>
              <Typewriter startFull={!typed} centered>
                <StyledText type="body">{name}</StyledText>
              </Typewriter>
            </Flex>
          )}
          {(topSuit || topName) && (
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
          )}
          {(botSuit || botName) && (
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
          )}
          </LinearGradient>
      </TouchableOpacity>
    </AnimatedPiece>
  );
};


const styles = {
  Home: StyleSheet.create({
    container: {
      // we use a standard playing card's ratio of 1.4:1
      height: 210,
      width: 150,
      borderRadius: 25,
      margin: 20,
      padding: 20,
    },
  })
}

const nonStyles = {
  Home: {
    containerGradient: {
      useAngle: true,
      angle: 135,
      angleCenter: { x: 0.5, y: 0.5 },
    },
    defaultGradient: ["#000000", "#000000"]
  }
}
