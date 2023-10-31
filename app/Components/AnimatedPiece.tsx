import { Animated, Easing } from "react-native";
import React, { FunctionComponent, useRef, useEffect, useImperativeHandle, ForwardRefRenderFunction } from "react";

type AnimatedPieceProps = {
  children: React.ReactNode;
  animationComplete?: () => void;
  overrideWidth?: number;
  overrideHeight?: number;
  startingHeight?: number;
  startingWidth?: number;
};

const AnimatedPieceComponent: ForwardRefRenderFunction<AnimatedPieceFunctions, AnimatedPieceProps> = (props, ref) => {
  // We can be given a starting height/width to avoid hiding the piece until initial layout.
  // This is advised if it's known that the piece will be animated in from a fixed size.
  // When you do this, be sure to include padding with the width/height!
  const givenStartingLayout = Boolean(props.startingWidth && props.startingHeight);
  const animatedOpacity = useRef(new Animated.Value(givenStartingLayout ? 1 : 0)).current;
  const animatedX = useRef(new Animated.Value(0)).current;
  const animatedY = useRef(new Animated.Value(0)).current;
  const animatedRotate = useRef(new Animated.Value(0)).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  const calculatedWidth = useRef(new Animated.Value(props.startingWidth || 0)).current;
  const calculatedHeight = useRef(new Animated.Value(props.startingHeight || 0)).current;
  const initialLayoutComplete = useRef(givenStartingLayout);

  const discard = () => {
  }

  // rotate the piece a little clockwise and counter clockwise rapidly
  const shake = () => {
    Animated.sequence([
      // tilt one way
      Animated.timing(animatedRotate, {
        toValue: 0.03,
        duration: 50,
        useNativeDriver: false,
      }),
      // then the other
      Animated.timing(animatedRotate, {
        toValue: -0.03,
        duration: 100,
        useNativeDriver: false,
      }),
      //so on
      Animated.timing(animatedRotate, {
        toValue: 0.03,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRotate, {
        toValue: -0.03,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRotate, {
        toValue: 0.03,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRotate, {
        toValue: -0.03,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRotate, {
        toValue: 0.03,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRotate, {
        toValue: -0.03,
        duration: 100,
        useNativeDriver: false,
      }),
      // return to center
      Animated.timing(animatedRotate, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start()
  }

  const drawn = () => {
  }

  // zoom out quick, suspend, and zoome back in
  const zoomOutAndBackIn = () => {
    Animated.sequence([
      Animated.timing(animatedScale, {
        // pick a side and slide horizontally slowly
        toValue: 0.75,
        duration: 550,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }),
      // slide back
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: 550,
        easing: Easing.exp,
        useNativeDriver: false,
      }),
    ]).start()
  }

  // drag the piece to a random side slowly, then drag it back
  const pace = () => {
    Animated.sequence([
      Animated.timing(animatedX, {
        // pick a side and slide horizontally slowly
        toValue: 100 * (Math.random() > 0.5 ? 1 : -1),
        duration: 3000,
        useNativeDriver: false,
      }),
      Animated.delay(2000),
      // slide back
      Animated.timing(animatedX, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: false,
      }),
    ]).start()
  }

  // fling up, starting to shake half way, then fall down, bouncing back into place (vertically and rotationally) as you land
  const jumpShake = () => {
    // parallel shake and jump
    Animated.parallel([
      // shake
      Animated.sequence([
        // wait to rise a bit before shaking
        Animated.delay(100),
        // tilt one way
        Animated.timing(animatedRotate, {
          toValue: 0.02,
          duration: 50,
          useNativeDriver: false,
        }),
        // then the other
        Animated.timing(animatedRotate, {
          toValue: -0.02,
          duration: 100,
          useNativeDriver: false,
        }),
        //so on
        Animated.timing(animatedRotate, {
          toValue: 0.02,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(animatedRotate, {
          toValue: -0.02,
          duration: 100,
          useNativeDriver: false,
        }),
        // delay so we can freeze leaned-back, then tilt to center while bouncing from landing
        Animated.delay(300),
        // return to center
        Animated.timing(animatedRotate, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }),
      ]),
      // jump
      Animated.sequence([
        // go up, decelerating
        Animated.timing(animatedY, {
          toValue: -50,
          duration: 500,
          easing: Easing.out(Easing.sin),
          useNativeDriver: false,
        }),
        // go down, accelerating
        Animated.timing(animatedY, {
          toValue: 0,
          duration: 750,
          easing: Easing.bounce,
          useNativeDriver: false,
        }),
      ])
    ]).start();
  }

  // fling a piece upwards, then drop it back down
  const jump = () => {
    Animated.sequence([
      // go up, decelerating
      Animated.timing(animatedY, {
        toValue: -100,
        duration: 500,
        easing: Easing.out(Easing.sin),
        useNativeDriver: false,
      }),
      // go down, accelerating
      Animated.timing(animatedY, {
        toValue: 0,
        duration: 750,
        easing: Easing.bounce,
        useNativeDriver: false,
      }),
    ]).start();
  }

  // fall directly downward, then fade in where it originally was
  const fallOffAndRespawn = () => {
    Animated.sequence([
      Animated.parallel([
        // move downward to off-screen, accelerating
        Animated.timing(animatedY, {
          toValue: 2000,
          duration: 1500,
          easing: Easing.sin,
          useNativeDriver: false,
        }),
        // at the same time, rotate slightly as if we just fell
        Animated.timing(animatedRotate, {
          toValue: 0.05,
          duration: 1000,
          useNativeDriver: false,
        }),
        // at the same time, move back a little bit to improve the fall look
        Animated.timing(animatedX, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
      // after the fall (and the piece is off-screen), make it disappear
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 1,
        useNativeDriver: false,
      }),
      // reset the position and rotation of the piece
      Animated.parallel([
        Animated.timing(animatedY, {
          toValue: 0,
          duration: 1,
          useNativeDriver: false,
        }),
        Animated.timing(animatedX, {
          toValue: 0,
          duration: 1,
          useNativeDriver: false,
        }),
        Animated.timing(animatedRotate, {
          toValue: 0,
          duration: 1,
          useNativeDriver: false,
        })
      ]),
      // now that its reset, fade it back in
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: false,
      })
    ]).start();
  }

  // expose all of our animation functions to our parent
  useImperativeHandle(ref, () => ({
    discard,
    shake,
    drawn,
    pace,
    jump,
    fallOffAndRespawn,
    jumpShake,
    zoomOutAndBackIn,
  }));


  return (
    // Outermost container is relatively positioned and either:
    // - adjusts its width/height to fit the floating innards
    // - adjusts its width/height for an animation or parent's desire
    <Animated.View style={{
      width: props.overrideWidth || calculatedWidth,
      height: props.overrideHeight || calculatedHeight,
    }}>
      {
        // The inner container is floating and contains all the passed-in children
        // This is wehre we apply all or most animations, so that we can move it around, scale it, etc without affecting sibling components
      }
      <Animated.View 
        style={{
          position: "absolute",
          opacity: animatedOpacity,
          transform: [
            { translateX: animatedX },
            { translateY: animatedY },
            { rotate: animatedRotate.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: ["-360deg", "0deg", "360deg"]
            })},
            { scale: animatedScale},
          ],
        }}
        onLayout={(e) => {
          // Here we keep our outer container in sync with the inner container's width/height
          calculatedWidth.setValue(e.nativeEvent.layout.width);
          calculatedHeight.setValue(e.nativeEvent.layout.height);
          if (!initialLayoutComplete.current) {
            // On initial layout our opacity is 0 so that we can update our width/height before the user sees it
            animatedOpacity.setValue(1);
            initialLayoutComplete.current = true;
          }
        }}
      >
        {
          // finally, the actual content
          props.children
        }
      </Animated.View>
    </Animated.View>
  )
};

export type AnimatedPieceFunctions = {
  discard: () => void;
  shake: () => void;
  drawn: () => void;
  pace: () => void;
  jump: () => void;
  fallOffAndRespawn: () => void;
  jumpShake: () => void;
  zoomOutAndBackIn: () => void;
}

export const AnimatedPiece = React.forwardRef<AnimatedPieceFunctions, AnimatedPieceProps>(AnimatedPieceComponent);
