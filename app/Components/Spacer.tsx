import { StyleSheet, View } from "react-native";
import React, { FunctionComponent, ReactNode } from "react";


// A component that is simple a blank space with a given height and/or width
type SpacerProps = {
  width?: number;
  height?: number;
};

export const Spacer: FunctionComponent<SpacerProps> = ({
  width = 0,
  height = 0,
}) => {
  return (
    <View style={{width, height}} />
  );
};
