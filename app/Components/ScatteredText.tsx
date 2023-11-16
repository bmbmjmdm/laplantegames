import { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { StyledText, TextProps } from "./Text";
import { v4 as uuid } from "uuid";

// A restrictive text component that only allows strings as children
type ScatteredTextSliceProps = TextProps & {
  children: string;
};
export const ScatteredTextSlice: FunctionComponent<ScatteredTextSliceProps> = (props) => {
  return <StyledText {...props} />;
};

// A component that makes it look like a typewriter typing out text on the screen
// currently assumes that the children wont change
export type TypewriterProps = TextProps & {
  // all children are either strings or TWText components
  children:
    | string
    | ReactElement<ScatteredTextSliceProps>
    | (string | ReactElement<ScatteredTextSliceProps>)[];
  // if true, will not animate in the text
  startScattered?: boolean;
};
export const Typewriter: FunctionComponent<TypewriterProps> = (props) => {
  const {
    children,
    speed = 100,
    startScattered = false,
    onFinish = () => {},
  } = props;

  // each letter of our scattered text, represented as an array of single-charcter ScatteredTextSlices
  const parsedText = useRef<ReactElement<ScatteredTextSliceProps>[]>(
    parseSubText(children)
  ).current;

  useEffect(() => {
    // if we start scattered, then call the scatter function at first render
    if (startScattered) {
      scatter({
        animated: false
      })
      return;
    }
  }, []);

  // scatter the text
  const scatter = ({
    animated = false,
    speed = 750,
    avoidSpace = {
      topLeft: { x: 0, y: 0 },
      bottomRight: { x: 0, y: 0 }
    }
  }) => {
    // asign each slice a random x & y transform. if animated is true, animate the transform from the current position to the new one
    // make sure these new coordinates (combined with the slice's original x/y) dont move the slice within the avoidSpace
    
  }

  // reassemble the text
  const reassemble = ({
    animated = false,
    speed = 750
  }) => {
    // reduce the transform on each slice to 0,0
    // if animated is true, animate the transform from the scattered position to the 0'd one
    
  }

  return <StyledText {...props}>{parsedText}</StyledText>;
};





// turns the children of Typewriter into an array of single-character ScatteredTextSlice components
// this is ripped directly from ./TypeWriter.tsx
const parseSubText = (
  text:
    | string
    | ReactElement<ScatteredTextSliceProps>
    | (string | ReactElement<ScatteredTextSliceProps>)[]
): ReactElement<ScatteredTextSliceProps>[] => {
  if (typeof text === "string") {
    return text.split("").map((char) => <ScatteredTextSlice key={uuid()}>{char}</ScatteredTextSlice>);
  } else if (Array.isArray(text)) {
    return text.map((subText) => parseSubText(subText)).flat();
  } else {
    const slimmedProps = { ...text.props, children: undefined };
    return text.props.children.split("").map((char) => (
      <ScatteredTextSlice {...slimmedProps} key={uuid()}>
        {char}
      </ScatteredTextSlice>
    ));
  }
};