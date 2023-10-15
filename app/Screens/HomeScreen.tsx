import { ScrollView } from "react-native";
import React, { FunctionComponent, useRef, useState, useEffect, ReactNode } from "react";
import { Card, Flex } from "../Components";
import { AnimatedScreen } from "./AnimatedScreen";
import { StackScreenProps } from "@react-navigation/stack";

export const HomeScreen: FunctionComponent<StackScreenProps<any>> = ({
  route,
}) => {

  const [filteredGames, setFilteredGames] = useState<ReactNode[]>(allGames)

  return (
    <AnimatedScreen>
      <ScrollView style={{ flex: 1 }}>
        <Flex row wrap>
          { filteredGames }
        </Flex>
      </ScrollView>
    </AnimatedScreen>
  )
};

const allGames = [
  (
    <Card key="You Know" name="You Know" />
  ),
  (
    <Card key="Search Word" name="Search Word" />
  ),
  (
    <Card key="Three Worlds" name="Three Worlds" />
  ),
]