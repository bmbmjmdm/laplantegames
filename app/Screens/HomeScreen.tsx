import { ScrollView } from "react-native";
import React, { FunctionComponent, useRef, useState, useEffect, ReactNode } from "react";
import { Card, Flex, PersonSVG, GroupSVG, HareSVG } from "../Components";
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
    <Card
      key="You Know"
      name="You Know"
      topSuit={<GroupSVG height={25} width={50} fill={"#ff00ff"} />}
      topName="3+"
      botSuit={<HareSVG height={25} width={25} fill={"#ff0077"} />}
      botName="5m"
    />
  ),
  (
    <Card
      key="Search Word"
      name="Search Word"
      topSuit={<PersonSVG height={25} width={25} fill={"#00ffff"} />}
      topName="1"
      botSuit={<HareSVG height={25} width={25} fill={"#ff0077"} />}
      botName="5m"
    />
  ),
  (
    <Card
      key="Three Worlds"
      name="Three Worlds"
      topSuit={<PersonSVG height={25} width={25} fill={"#00ffff"} />}
      topName="1"
      botSuit={<HareSVG height={25} width={25} fill={"#ff0077"} />}
      botName="5m"
    />
  ),
]