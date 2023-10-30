import { ScrollView, TouchableOpacity, View } from "react-native";
import React, { FunctionComponent, useRef, useState, useEffect, ReactNode } from "react";
import { Card, Flex, PersonSVG, GroupSVG, HareSVG } from "../Components";
import { AnimatedScreen } from "./AnimatedScreen";
import { StackScreenProps } from "@react-navigation/stack";
import { TurtleSVG } from "../Components/SVG";

const FAST = 15

// The home screen shows a list of games that the user can play, along with a filter for them
export const HomeScreen: FunctionComponent<StackScreenProps<any>> = ({
  route,
}) => {
  // these are the various filters we can set to 
  const [showSolo, setShowSolo] = useState<boolean>(true)
  const [showGroup, setShowGroup] = useState<boolean>(true)
  const [showFast, setShowFast] = useState<boolean>(true)
  const [showSlow, setShowSlow] = useState<boolean>(true)

  // these are the cards that are currently visible, based on the user's filters
  const [filteredGames, setFilteredGames] = useState(allGames)
  // any time the filters update, update our visible cards
  useEffect(() => {
      setFilteredGames(allGames.filter((game) => {
        if (game.solo && !showSolo) return false
        if (!game.solo && !showGroup) return false
        if (Number(game.time) <= FAST && !showFast) return false
        if (Number(game.time) > FAST && !showSlow) return false
        return true
      }))
    }, [showSolo, showGroup, showFast, showSlow]
  )

  // TODO improve the code health here, probably make a wrapper component for our SVGs
  return (
    <AnimatedScreen>
      <Flex row centered style={{ height: 100, padding: 25 }}>
        <TouchableOpacity onPress={() => setShowSolo(!showSolo)} style={{ paddingRight: 25 }}>
          <PersonSVG height={50} width={50} fill={!showSolo ? "#ffffffaa" : "#00ffff"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowGroup(!showGroup)} style={{ paddingRight: 25 }}>
          <GroupSVG height={50} width={100} fill={!showGroup ? "#ffffffaa" : "#ff00ff"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowFast(!showFast)} style={{ paddingRight: 25 }}>
          <HareSVG height={50} width={50} fill={!showFast ? "#ffffffaa" : "#ff0077"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowSlow(!showSlow)} style={{ paddingRight: 25 }}>
          <TurtleSVG height={50} width={50} fill={!showSlow ? "#ffffffaa" : "#44fcb6"} />
        </TouchableOpacity>
      </Flex>
      <ScrollView style={{ flex: 1 }}>
        <Flex row wrap centered full style={{ minHeight: 400 }}>
          {
            filteredGames.map((game) => (
              <Card
                key={game.name}
                name={game.name}
                topSuit={game.solo ? solo : group}
                topName={game.players}
                botSuit={Number(game.time) > FAST ? slow : fast}
                botName={game.time + "m"}
              />
            ))
          }
        </Flex>
      </ScrollView>
    </AnimatedScreen>
  )
};

const group = <GroupSVG height={25} width={50} fill={"#ff00ff"} />
const fast = <HareSVG height={25} width={25} fill={"#ff0077"} />
const solo = <PersonSVG height={25} width={25} fill={"#00ffff"} />
const slow = <TurtleSVG height={25} width={25} fill={"#44fcb6"} />

const allGames = [
  {
    name: "You Know",
    players: "2-6",
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
    time: "30",
  },
]
