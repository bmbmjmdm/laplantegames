import { Animated, ImageProps, ActivityIndicator, View } from "react-native";
import React, { FunctionComponent, useRef, useEffect } from "react";

type AnimatedPieceProps = {
  children: React.ReactNode;
  animationComplete?: () => void;
  overrideWidth?: number;
  overrideHeight?: number;
};

export const AnimatedPiece: FunctionComponent<AnimatedPieceProps> = (props) => {
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const animatedX = useRef(new Animated.Value(0)).current;
  const animatedY = useRef(new Animated.Value(0)).current;
  const animatedRotate = useRef(new Animated.Value(0)).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  const calculatedWidth = useRef(new Animated.Value(0)).current;
  const calculatedHeight = useRef(new Animated.Value(0)).current;
  const initialLayoutComplete = useRef(false);

  const discard = () => {
    // make these various animations available to our parent 
  }
  const shake = () => {
  }
  const drawn = () => {
  }


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
              inputRange: [0, 1],
              outputRange: ["0deg", "360deg"]
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
