import { Animated, Dimensions, Easing } from "react-native";
import React, { FunctionComponent, useRef, useEffect, useImperativeHandle, ForwardRefRenderFunction } from "react";
import { Coordinate, Distance, Quadrant, getQuadrantPosition } from "./ScreenCoordination";


// a zoomed corner starts by fading in with distance 2 from viewer (impossible to pass this, it is assumed to be the starting position). it is just outside its quadrant in the direction of zoomDirection
// it will immediately update to 1 distance, zooming in a bit but still be small and move to its proper quadrant
// if it changes to 0 distance, it will zoom in to its normal size as it moves to the center of the screen
// if it changes to -1 distance, it will zoom in further past the user, exiting the screen in the direction of zoomDirection
// currently we support going from 1 to 0, 0 to -1, as well as 1 to -1. 
type ZoomedCornerProps = {
  children: React.ReactNode;
  quadrant: Quadrant;
  distanceFromViewer: Distance;
  zoomDirection: Quadrant;
};

export const ZoomedCorner: FunctionComponent<ZoomedCornerProps> = (props, ref) => {
  const { children, quadrant, distanceFromViewer, zoomDirection } = props;

  const speed = 650;
  const previousDistance = useRef(2);
  const animatedX = useRef(new Animated.Value(0)).current;
  const animatedY = useRef(new Animated.Value(0)).current;
  const animatedScale = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  // helper function to animate the coordinates of the corner because we'll be doing this a lot based on distance changes
  const animateCoordinates = ({x, y}: Coordinate) => {
    return Animated.parallel([
      Animated.timing(animatedX, {
        toValue: x,
        duration: speed,
        easing: Easing.exp,
        useNativeDriver: false,
      }),
      Animated.timing(animatedY, {
        toValue: y,
        duration: speed,
        easing: Easing.exp,
        useNativeDriver: false,
      }),
    ])
  }

  // this useEffect will occur once on initial render and then again whenever distanceFromViewer changes
  // in it, it will determine the proper position/scaling for the corner based on the change to distanceFromViewer and animate it there
  useEffect(() => {
    // we just spawned in so we animate to our initial quadrant
    if (distanceFromViewer === 1 && previousDistance.current === 2) {

      // determine the quadrant coordinates for this corner
      const {x: finalLeft, y: finalTop} = getQuadrantPosition(quadrant);
      // determine the starting offset
      const {x: offsetLeft, y: offsetTop} = getQuadrantPosition(zoomDirection);
      // apply the offset based on the *opposite* direction of its zoom
      const initialTop = finalTop - offsetTop;
      const initialLeft = finalLeft - offsetLeft;
      // no animation for starting position
      animatedX.setValue(initialLeft);
      animatedY.setValue(initialTop);

      // now animate it into its proper quadrant while fading in / scaling up slightly
      Animated.parallel([
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: speed,
          easing: Easing.exp,
          useNativeDriver: false,
        }),
        Animated.timing(animatedScale, {
          toValue: 0.2,
          duration: speed,
          easing: Easing.exp,
          useNativeDriver: false,
        }),
        animateCoordinates({
          x: finalLeft,
          y: finalTop
        })
      ]).start()
    }

    // we just got chosen to zoom/scale to the center of the screen from our initial quadrant
    if (distanceFromViewer === 0 && previousDistance.current === 1) {
      Animated.parallel([
        Animated.timing(animatedScale, {
          toValue: 1,
          duration: speed,
          easing: Easing.exp,
          useNativeDriver: false,
        }),
        animateCoordinates({
          x: 0,
          y: 0
        })
      ]).start()
    }

    // we are done being in the middle of the screen and now must zoom out of the screen from the center
    if (distanceFromViewer === -1 && previousDistance.current === 0) {
      const {x: finalLeft, y: finalTop} = getQuadrantPosition(zoomDirection);
      // multiplying by 4 ensures we're fully off the screen
      Animated.parallel([
        Animated.timing(animatedScale, {
          toValue: 1.5,
          duration: speed,
          easing: Easing.exp,
          useNativeDriver: false,
        }),
        animateCoordinates({
          x: finalLeft * 4,
          y: finalTop * 4
        })
      ]).start()
    }

    // we were not chosen to be in the center of the screen so we must zoom out of the screen from our quadrant
    if (distanceFromViewer === -1 && previousDistance.current === 1) {
      const {x: finalLeft, y: finalTop} = getQuadrantPosition(zoomDirection);
      // multiplying by 4 ensures we're fully off the screen
      Animated.parallel([
        Animated.timing(animatedScale, {
          toValue: 0.4,
          duration: speed,
          easing: Easing.exp,
          useNativeDriver: false,
        }),
        animateCoordinates({
          x: finalLeft * 4,
          y: finalTop * 4
        })
      ]).start()
    }

    // after we trigger our animation, update out previous distance to the current one
    previousDistance.current = distanceFromViewer

  // run this whenever distance changes
  }, [distanceFromViewer]);

  return (
    <Animated.View 
      style={{
        position: "absolute",
        opacity: animatedOpacity,
        left: animatedX,
        top: animatedY,
        transform: [
          { scale: animatedScale},
        ],
      }}
    >
      {children}
    </Animated.View>
  )
};
