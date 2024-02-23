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

  // declare SVGs for cards and filters
  const group = <GroupSVG height={45} width={60} fill={"#CEC1FF"} />
  const fast = <HareSVG height={45} width={45} fill={"#FFC1E0"} />
  const solo = <PersonSVG height={45} width={45} fill={"#C1F3FF"} />
  const slow = <TurtleSVG height={45} width={45} fill={"#C1FFC5"} />
  const groupFilter = <GroupSVG height={50} width={100} fill={!showGroup ? "#ffffffaa" : "#ff00ff"} />
  const fastFilter = <HareSVG height={50} width={50} fill={!showFast ? "#ffffffaa" : "#FF007B"} />
  const soloFilter = <PersonSVG height={50} width={50} fill={!showSolo ? "#ffffffaa" : "#00FFF6"} />
  const slowFilter = <TurtleSVG height={50} width={50} fill={!showSlow ? "#ffffffaa" : "#00FF72"} />
  const paddingRight = { paddingRight: 25 }

  return (
    <AnimatedScreen>
      <ScrollView style={{ flex: 1 }}>
        {/* removing filters for now
          <Flex row centered style={{ height: 100, padding: 25 }}>
            <TouchableOpacity onPress={() => setShowSolo(!showSolo)} style={paddingRight}>
              { soloFilter }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowGroup(!showGroup)} style={paddingRight}>
              { groupFilter }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowFast(!showFast)} style={paddingRight}>
              { fastFilter }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSlow(!showSlow)}>
              { slowFilter }
            </TouchableOpacity>
          </Flex>
        */}
        <Flex row wrap centered full>
          {
            filteredGames.map((game) => (
              <Card
                key={game.name}
                name={game.name}
                firstSuit={game.solo ? solo : group}
                firstDetail={game.players + " players"}
                secondSuit={Number(game.time) > FAST ? slow : fast}
                secondDetail={game.time + " minutes"}
                //description={"Lots of fun"}
              />
            ))
          }
        </Flex>
        <View style={{ height: 400 }} />
      </ScrollView>
    </AnimatedScreen>
  )
};

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
