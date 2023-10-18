import { Animated, ImageProps, ActivityIndicator, View } from "react-native";
import React, { FunctionComponent } from "react";

type AnimatedPieceProps = {
  children: React.ReactNode;
  animationComplete?: () => void;
};

export const AnimatedPiece: FunctionComponent<AnimatedPieceProps> = (props) => {
  const discard = () => {
    // make these various animations available to our parent 
  }
  const shake = () => {
  }

  return (
    <Animated.View>
      { props.children }
    </Animated.View>
  )
};
