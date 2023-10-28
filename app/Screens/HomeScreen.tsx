import { ScrollView, View } from "react-native";
import React, { FunctionComponent, useRef, useState, useEffect, ReactNode } from "react";
import { Card, Flex, PersonSVG, GroupSVG, HareSVG } from "../Components";
import { AnimatedScreen } from "./AnimatedScreen";
import { StackScreenProps } from "@react-navigation/stack";

export const HomeScreen: FunctionComponent<StackScreenProps<any>> = ({
  route,
}) => {
  // convert our list of games into their card component form
  const allGameCards = useRef<ReactNode[]>(allGames.map((game) => {
    return (
      <Card
        key={game.name}
        name={game.name}
        topSuit={game.solo ? solo : group}
        topName={game.players}
        botSuit={Number(game.time) > 10 ? <View/> : fast} // TODO make the slow icon
        botName={game.time + "m"}
      />
    )
  })).current

  // these are the cards that are currently visible, based on the user's filters
  const [filteredGames, setFilteredGames] = useState<ReactNode[]>(allGameCards)

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

const group = <GroupSVG height={25} width={50} fill={"#ff00ff"} />
const fast = <HareSVG height={25} width={25} fill={"#ff0077"} />
const solo = <PersonSVG height={25} width={25} fill={"#00ffff"} />

const allGames = [
  {
    name: "You Know",
    players: "3",
    solo: false,
    time: "5",
  },
  {
    name: "Search Word",
    players: "1",
    solo: true,
    time: "5",
  },
  {
    name: "Three Worlds",
    players: "1",
    solo: true,
    time: "5",
  },
]
