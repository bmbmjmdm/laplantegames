import { FunctionComponent, ReactElement, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { StyledText, TextProps } from "./Text";
import { v4 as uuid } from "uuid";
import { Animated, TextStyle, View, ViewStyle } from "react-native";

// A restrictive text component that only allows strings as children
type ScatteredTextSliceProps = TextProps & {
  children: string;
};
type scatterProps = {
  animated: boolean;
  avoidSpace: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
type ScatteredTextSliceRef = {
  scatter: Function;
  reassemble: Function;
}

const ScatteredTextSlice = forwardRef<ScatteredTextSliceRef, ScatteredTextSliceProps>(
  (props: ScatteredTextSliceProps, ref) => {
    const animatedX = useRef(new Animated.Value(0)).current;
    const animatedY = useRef(new Animated.Value(0)).current;
    const animatedRotate = useRef(new Animated.Value(0)).current;
    const x = useRef(0);
    const y = useRef(0);
    useImperativeHandle(ref, () => ({
      scatter,
      reassemble,
    }));

    // scatter the text
    const scatter = ({ animated = false, avoidSpace }: scatterProps) => {
      // asign the slice a random x & y transform.
      let newX = 0;
      let newY = 0;
      let newXTransform = 0;
      let newYTransform = 0;
      let newRotate = 0;
      do {
        newXTransform = Math.random() * 1000;
        newYTransform = Math.random() * 1000;
        if (Math.random() < 0.5) newXTransform *= -1;
        if (Math.random() < 0.5) newYTransform *= -1;
        newX = x.current + newXTransform;
        newY = y.current + newYTransform;
        newRotate = Math.random() * 360
      }
      // make sure these new coordinates (combined with the slice's original x/y) dont move the slice within the avoidSpace
      while (
        avoidSpace.x < newX && newX < avoidSpace.x + avoidSpace.width
        && avoidSpace.y < newY && newY < avoidSpace.y + avoidSpace.height
      )

      //if animated is true, animate the transform from the current position to the new one
      if (animated) {
        Animated.parallel([
          Animated.timing(animatedX, {
            toValue: newXTransform,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(animatedY, {
            toValue: newYTransform,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(animatedRotate, {
            toValue: newRotate,
            duration: 650,
            useNativeDriver: true,
          }),
        ]).start();
      }
      else {
        animatedX.setValue(newXTransform);
        animatedY.setValue(newYTransform);
        animatedRotate.setValue(newRotate);
      }
    }

    // reassemble the text
    const reassemble = () => {
      // reduce the transform on the slice to 0,0
      Animated.parallel([
        Animated.timing(animatedX, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(animatedY, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(animatedRotate, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return (
      <StyledText
        {...props}
        animated={true}
        onLayout={(e) => {
          x.current = e.nativeEvent.layout.x;
          y.current = e.nativeEvent.layout.y;
        }}
        style={{
          ...props.style || {},
          transform: [
            { translateX: animatedX },
            { translateY: animatedY },
            { rotate: animatedRotate.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg']
              })
            }
          ]
        }}
      />
    )
  }
);


// A component that makes it look like a typewriter typing out text on the screen
// currently assumes that the children wont change
export type ScatteredProps = {
  textProps?: TextProps;
  // all children are either strings or TWText components
  children:
    | string
    | ReactElement<ScatteredTextSliceProps>
    | (string | ReactElement<ScatteredTextSliceProps>)[];
  scattered: boolean;
  avoidSpace: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};
export const ScatteredText: FunctionComponent<ScatteredProps> = (props) => {
  const {
    children,
    scattered,
    avoidSpace,
    textProps,
  } = props;
  const firstRender = useRef(true)

  // each letter of our scattered text, represented as an array of single-charcter ScatteredTextSlices
  const {slices, refs} = useRef(
    parseSubText(children, textProps)
  ).current;

  // whenever scattered changes, we either scatter or reassemble the text
  useEffect(() => {
    if (scattered) {
      refs.forEach(ref => ref?.scatter({
        // dont animate if we are on the first render
        animated: !firstRender.current,
        avoidSpace
      }))
    }
    else {
      refs.forEach(ref => ref?.reassemble())
    }
    firstRender.current = false
  }, [scattered]);

  return <View style={{flex: 1, flexWrap: "wrap", flexDirection: "row"}}>{slices}</View>;
};



// turns the children of Typewriter into an array of single-character ScatteredTextSlice components
// this is ripped directly from ./TypeWriter.tsx
const parseSubText = (
  text:
    | string
    | ReactElement<ScatteredTextSliceProps>
    | (string | ReactElement<ScatteredTextSliceProps>)[],
  textProps?: TextProps
): {
  slices: ReactElement<ScatteredTextSliceProps>[],
  refs: React.RefAttributes<ScatteredTextSliceRef>[]
} => {
  let slices: ReactElement<ScatteredTextSliceProps>[] = [];
  let refs: React.RefAttributes<ScatteredTextSliceRef>[] = [];
  textProps = textProps || {};

  if (typeof text === "string") {
    slices = text.split("").map((char) => <ScatteredTextSlice {...textProps} key={uuid()} ref={r => refs.push(r)}>{char}</ScatteredTextSlice>);
  
  } else if (Array.isArray(text)) {
    const recursiveMap = text.map((subText) => parseSubText(subText, textProps));
    recursiveMap.map(e => e.slices).forEach(e => slices.push(...e))
    recursiveMap.map(e => e.refs).forEach(e => refs.push(...e))
  } else {
    const slimmedProps = { textProps, ...text.props, children: undefined };
    slices = text.props.children.split("").map((char) => (
      <ScatteredTextSlice {...slimmedProps} key={uuid()} ref={r => refs.push(r)}>
        {char}
      </ScatteredTextSlice>
    ));
  }

  return {
    slices,
    refs
  }
};