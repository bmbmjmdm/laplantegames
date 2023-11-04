import { StyleSheet, TouchableOpacity } from "react-native";
import React, { FunctionComponent, ReactElement, useEffect, useImperativeHandle, useRef } from "react";
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
  // TODO get the current page name from redux
  const curStyle = { ...styles.Home, ...nonStyles.Home }

  // a reference for each of the card's section's animation component
  const containerAnimations = useRef<AnimatedPieceFunctions>(null);
  const nameAnimations = useRef<AnimatedPieceFunctions>(null);
  const topAnimations = useRef<AnimatedPieceFunctions>(null);
  const botAnimations = useRef<AnimatedPieceFunctions>(null);

  // a list of all animations that a card can do.
  // when triggered, each will trigger the appropriate animations on all of the card's subcomponents
  const shake = () => {
    containerAnimations.current?.shake()
    // the contents of the card shake slightly delayed to simulate reacting to the container shaking
    setTimeout(() => {
      nameAnimations.current?.shake()
      topAnimations.current?.shake()
      botAnimations.current?.shake()
    }, 50)
  }
  
  const pace = () => {
    const left = Math.random() > 0.5
    containerAnimations.current?.pace({left, ...curStyle.paceContainer})
    // the contents of the card slide in the opposite direction a tiny bit to simulate drag/weight
    setTimeout(() => {
        nameAnimations.current?.pace({left: !left, ...curStyle.paceContents})
        botAnimations.current?.pace({left: !left, ...curStyle.paceContents})
        topAnimations.current?.pace({left: !left, ...curStyle.paceContents})
    }, 300)
  }
  
  const jump = () => {
    containerAnimations.current?.jump(curStyle.jumpContainer)
    // the contents of the card jump/fall in the opposite direction a tiny bit to simulate drag/weight
    setTimeout(() => {
        nameAnimations.current?.jump({inverse: true, ...curStyle.jumpContents})
        botAnimations.current?.jump({inverse: true, ...curStyle.jumpContents})
        topAnimations.current?.jump({inverse: true, ...curStyle.jumpContents})
    }, 50)
  }
  
  const fallOffAndRespawn = () => {
    containerAnimations.current?.fallOffAndRespawn()
  }
  
  const jumpShake = () => {
    containerAnimations.current?.jumpShake(curStyle.jumpShakeContainer)
    /*
    setTimeout(() => {
        nameAnimations.current?.jumpShake({inverse: true, distance: 1})
        botAnimations.current?.jumpShake({inverse: true, distance: 1})
        topAnimations.current?.jumpShake({inverse: true, distance: 1})
    }, 75)
    */
  }
  
  const zoomOutAndBackIn = () => {
    // the contents of the card zoom out to add a double-layer zoom effect
    containerAnimations.current?.zoomOutAndBackIn()
    nameAnimations.current?.zoomOutAndBackIn()
    topAnimations.current?.zoomOutAndBackIn()
    botAnimations.current?.zoomOutAndBackIn()
  }

  // a special property of home screen cards is they have random animations applied to them at random intervals
  const randomAnimationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    // TODO if we're on the Homepage, each card will use a random animation every 5-15 seconds
    if (true) {
      // remember the interval so we can clear it later
      randomAnimationInterval.current = setInterval(() => {
        // our animation options
        const animations = [
          shake,
          pace,
          jump,
          jumpShake,
          zoomOutAndBackIn,
          fallOffAndRespawn
        ]
        // pick one at random and do it
        animations[Math.floor(Math.random() * animations.length)]?.()
        // wait 10-25 seconds
      }, 10000 + Math.random() * 15000)
    }
    // clear interval on unmount
    return () => {
      if (randomAnimationInterval.current) {
        clearInterval(randomAnimationInterval.current)
      }
    }
  }, [])

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
      startingHeight={styles.Home.container.height + styles.Home.container.padding * 2}
      startingWidth={styles.Home.container.width + styles.Home.container.padding * 2}
      ref={containerAnimations}
    >
      <TouchableOpacity activeOpacity={1} onPress={() => {}}>
        <LinearGradient
          style={curStyle.container}
          colors={gradient}
          {...curStyle.containerGradient}
        >
          {name && (
            <Flex flex={3} centered>
              <AnimatedPiece
                animationComplete={() => {}}
                startingWidth={styles.Home.container.width - styles.Home.container.padding * 2}
                ref={nameAnimations}
              >
                <Flex full>
                  <Typewriter startFull={!typed} centered>
                    <StyledText type="body">{name}</StyledText>
                  </Typewriter>
                </Flex>
              </AnimatedPiece>
            </Flex>
          )}
          {(topSuit || topName) && (
            <Flex flex={1} centered>
              <AnimatedPiece
                animationComplete={() => {}}
                startingWidth={styles.Home.container.width - styles.Home.container.padding * 2}
                ref={topAnimations}
              >
                <Flex centered>
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
              </AnimatedPiece>
            </Flex>
          )}
          {(botSuit || botName) && (
            <Flex flex={1} centered>
              <AnimatedPiece
                animationComplete={() => {}}
                startingWidth={styles.Home.container.width - styles.Home.container.padding * 2}
                ref={botAnimations}
              >
                <Flex centered>
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
              </AnimatedPiece>
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
    defaultGradient: ["#000000", "#000000"],
    paceContainer: {

    },
    jumpContainer: {

    },
    jumpShakeContainer: {

    },
    paceContents: {
      // the distance the card's contents will pace in the opposite direction of the container's pace
      distance: 10,
    },
    jumpContents: {
      // the distance the card's contents will jump/fall in the opposite direction of the container's jump
      distance: 20,
    }
  }
}
