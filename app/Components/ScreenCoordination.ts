import { Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export type Quadrant = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export type Distance = -1 | 0 | 1;
export type Coordinate = {x: number, y: number};

export const oppositeDirection = (direction: Quadrant):Quadrant => {
  if (direction === "topLeft") {
    return "bottomRight";
  } else if (direction === "topRight") {
    return "bottomLeft";
  } else if (direction === "bottomLeft") {
    return "topRight";
  } else {
    //final case of direction === "bottomRight"
    return "topLeft";
  }
}


export const getQuadrantPosition = (quadrant: Quadrant):Coordinate => {
  let xDistance = screenWidth/4;
  let yDistance = screenHeight/4;
  if (quadrant === "topLeft") {
    return {
      x: -xDistance,
      y: -yDistance
    }
  } else if (quadrant === "topRight") {
    return {
      x: xDistance,
      y: -yDistance
    }
  } else if (quadrant === "bottomLeft") {
    return {
      x: -xDistance,
      y: yDistance
    }
  } else {
    //final case of quadrant === "bottomRight"
    return {
      x: xDistance,
      y: yDistance
    }
  }
}