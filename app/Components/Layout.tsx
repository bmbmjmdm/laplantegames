import { View, ViewStyle } from "react-native";
import React, { FunctionComponent, ReactNode } from "react";

// A component that makes it easy to create layout components, such as full-width, centered, row, etc
type FlexProps = {
  full?: boolean;
  fullWidth?: boolean;
  centered?: boolean;
  centeredVertical?: boolean;
  style?: ViewStyle;
  children: ReactNode;
  row?: boolean;
  wrap?: boolean;
  reverse?: boolean;
  flex?: number;
};
export const Flex: FunctionComponent<FlexProps> = ({
  flex = undefined,
  full = false,
  fullWidth = false,
  centered = false,
  centeredVertical = false,
  style = {},
  row = false,
  wrap = false,
  reverse = false,
  children,
}) => {
  return (
    <View
      style={[
        typeof flex === "number" ? { flex } : {},
        full ? {flex: 1} : {},
        fullWidth ? { width: "100%" } : {},
        centered ? {
          alignItems: "center",
          justifyContent: "center",
        } : {},
        centeredVertical && row ? { alignItems: "center" } : {},
        centeredVertical && !row ? { justifyContent: "center" } : {},
        row ? { flexDirection: "row" } : {},
        reverse && row ? { flexDirection: "row-reverse" } : {},
        wrap ? { flexWrap: "wrap" } : {},
        reverse && !row ? { flexDirection: "column-reverse" } : {},
        style,
      ]}
    >
      {children}
    </View>
  );
};

// A component that makes padding less messy
type PaddingProps = {
  vertical?: number;
  horizontal?: number;
};
export const Padding: FunctionComponent<PaddingProps> = ({
  vertical = 0,
  horizontal = 0,
}) => {
  return (
    <View
      style={{
        paddingTop: vertical,
        paddingLeft: horizontal,
      }}
    />
  );
};

