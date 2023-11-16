import 'react-native-get-random-values';
import { Dimensions, ScrollView, TouchableOpacity, View, ViewStyle } from "react-native";
import React, { FunctionComponent, useRef, useState, useEffect, ReactNode, useCallback } from "react";
import { Flex, StyledText, } from "../Components";
import { StackScreenProps } from "@react-navigation/stack";
import { ZoomedCorner } from "../Components/ZoomedCorner";
import { Distance, Quadrant, oppositeDirection } from "../Components/ScreenCoordination";
import { v4 } from "uuid";

export const PoetryHomeScreen: FunctionComponent<StackScreenProps<any>> = ({
  route,
}) => {
  // we show 5 poems at a time:
  // 1 is in the center of the screen and takes up most of it. it has 0 distance and is assembled 
  // the other 4 are in the 4 corners, have distance 1, and are scattered
  // at initial render, the 1 in the center is empty
  // then, when a user clicks on an enlarged letter of a poem in the corners (TODO), that poem will zoom into the center and assemble. The one in the center will exit the screen with distance -1 and scatter, and the other 3 in the corners will also exit with -1 distance. these all go in the direction opposite to the quadrant of the poem clicked
  // also while this happens 4 new poems will fill the quadrants that were just emptied, fading in at distance 2 and zooming to distance 1 
  // we just pull from a big random list of poems. the user should not see a poem again that they clicked on, but can re-see ones that werent clicked before

  const poemContainer = useRef<ViewStyle>({
    height: Dimensions.get("window").height * 0.66, 
    width: Dimensions.get("window").width * 0.75, 
    overflow: "visible", 
    position: "absolute"
  }).current

  // we maintain a list of the poems that we havent shown the user yet, and a list of the poems that we have shown the user
  const poemsUnused = useRef([
    "Hello world\nA song so sweet that i took her to\n lorem epgo smdmf ddk iofk ksd \n ksdfsdfjsdf o sdfj djf dkl \n jksdfsdkf k fkdfkdfkd fdkfskdf sd\n ksdfks fsdfksdfsdk d dfskdf \n ksdfksdfd kd kdf ksdf kdf sdfpaspa as pas as \n aksd asd aosdo asod asmdaksd asod \n aksdasiod aisd asd aks \n aisd aksd kasd aosd oasd asd asd",
    "Hello world\nA song so sweet that i took her to\n lorem epgo smdmf ddk iofk ksd \n ksdfsdfjsdf o sdfj djf dkl \n jksdfsdkf k fkdfkdfkd fdkfskdf sd\n ksdfks fsdfksdfsdk d dfskdf \n ksdfksdfd kd kdf ksdf kdf sdfpaspa as pas as \n aksd asd aosdo asod asmdaksd asod \n aksdasiod aisd asd aks \n aisd aksd kasd aosd oasd asd",
    "Hello world\nA song so sweet that i took her to\n lorem epgo smdmf ddk iofk ksd \n ksdfsdfjsdf o sdfj djf dkl \n jksdfsdkf k fkdfkdfkd fdkfskdf sd\n ksdfks fsdfksdfsdk d dfskdf \n ksdfksdfd kd kdf ksdf kdf sdfpaspa as pas as \n aksd asd aosdo asod asmdaksd asod \n aksdasiod aisd asd aks \n aisd aksd kasd aosd o",
    "Hello world\nA song so sweet that i took her to\n lorem epgo smdmf ddk iofk ksd \n ksdfsdfjsdf o sdfj djf dkl \n jksdfsdkf k fkdfkdfkd fdkfskdf sd\n ksdfks fsdfksdfsdk d dfskdf \n ksdfksdfd kd kdf ksdf kdf sdfpaspa as pas as \n aksd asd aosdo asod asmdaksd asod \n aksdasiod aisd asd aks \n aisd aksd",
    "Hello world\nA song so sweet that i took her to\n lorem epgo smdmf ddk iofk ksd \n ksdfsdfjsdf o sdfj djf dkl \n jksdfsdkf k fkdfkdfkd fdkfskdf sd\n ksdfks fsdfksdfsdk d dfskdf \n ksdfksdfd kd kdf ksdf kdf sdfpaspa as pas as \n aksd asd aosdo asod asmdaksd asod \n aksdasiod aisd asd aks \n aisd aksd kasd aosd oasd asss",
    "Hello world\nA song so sweet that i took her to\n lorem epgo smdmf ddk iofk ksd \n ksdfsdfjsdf o sdfj djf dkl \n jksdfsdkf k fkdfkdfkd fdkfskdf sd\n ksdfks fsdfksdfsdk d dfskdf \n ksdfksdfd kd kdf ksdf kdf sdfpaspa as pas as \n aksd asd aosdo asod asmdaksd asod \n aksdasiod aisd asd aks \n aisd aksd kasd aosd oasd asd aasdasds",
    "Hello world\nA song so sweet that i took her to\n lorem epgo smdmf ddk iofk ksd \n ksdfsdfjsdf o sdfj djf dkl \n jksdfsdkf k fkdfkdfkd fdkfskdf sd\n ksdfks fsdfksdfsdk d dfskdf \n ksdfksdfd kd kdf ksdf kdf sdfpaspa as pas as \n aksd asd aosdo asod asmdaksd asod \n aksdasiod aisd asd aks \n aisd aksd kasd aosd oasd asd aaa",
    "Hello world\nA song so sweet that i took her to\n lorem epgo smdmf ddk iofk ksd \n ksdfsdfjsdf o sdfj djf dkl \n jksdfsdkf k fkdfkdfkd fdkfskdf sd\n ksdfks fsdfksdfsdk d dfskdf \n ksdfksdfd kd kdf ksdf kdf sdfpaspa as pas as \n aksd asd aosdo asod asmdaksd asod \n aksdasiod aisd asd aks \n aisd aksd kasd aosd oasd asddd",
    "Hello world\nA song so sweet that i took her to\n lorem epgo smdmf ddk iofk ksd \n ksdfsdfjsdf o sdfj djf dkl \n jksdfsdkf k fkdfkdfkd fdkfskdf sd\n ksdfks fsdfksdfsdk d dfskdf \n ksdfksdfd kd kdf ksdf kdf sdfpaspa as pas as \n aksd asd aosdo asod asmdaksd asod \n aksdasiod aisd asd aks \n aisd aksd kasd aosdw",
    "Hello world\nA song so sweet that i took her to\n lorem epgo smdmf ddk iofk ksd \n ksdfsdfjsdf o sdfj djf dkl \n jksdfsdkf k fkdfkdfkd fdkfskdf sd\n ksdfks fsdfksdfsdk d dfskdf \n ksdfksdfd kd kdf ksdf kdf sdfpaspa as pas as \n aksd asd aosdo asod asmdaksd asod \n aksdasiod aisd asd aks \n aiq",
    "Hello world\nA song so sweet that i took her to\n lorem epgo smdmf ddk iofk ksd \n ksdfsdfjsdf o sdfj djf dkl \n jksdfsdkf k fkdfkdfkd fdkfskdf sd\n ksdfks fsdfksdfsdk d dfskdf \n ksdfksdfd kd kdf ksdf kdf sdfpaspa as pas as \n aksd asd aosdo asod asmdaksd asod \n aksdasiod aisd asd aks \n aisd aksd kasd aosd oasd asd as"
  ]).current
  const poemsUsed = useRef<string[]>([]).current

  const getRandomPoem = () => {
    // reset poems if we've used them all
    // TODO keep track of poems seen in background vs center seperately
    if (poemsUnused.length === 0) {
      poemsUnused.push(...poemsUsed)
      poemsUsed.length = 0
    }
    const index = Math.floor(Math.random() * poemsUnused.length)
    const poem = poemsUnused.splice(index, 1)[0]
    poemsUsed.push(poem)
    return poem
  }
  
  // we maintain a property list for all the poems we want to render
  // whenever it updates, we set poemComponentList to be a list of the corresponding poem components to render
  const [poemComponentList, setPoemComponentList] = useState<ReactNode[]>([])
  type PoemProps = {
    text: string,
    distance: Distance,
    quadrant: Quadrant,
    zoomDirection: Quadrant,
    id: string,
  }
  const poemPropertyList = useRef<PoemProps[]>([]).current

  const pushNewPoems = (zoomDirection:Quadrant) => {
    poemPropertyList.push({
      text: getRandomPoem(),
      distance: 1,
      quadrant: "topLeft",
      zoomDirection,
      id: v4(),
    })
    poemPropertyList.push({
      text: getRandomPoem(),
      distance: 1,
      quadrant: "topRight",
      zoomDirection,
      id: v4(),
    })
    poemPropertyList.push({
      text: getRandomPoem(),
      distance: 1,
      quadrant: "bottomLeft",
      zoomDirection,
      id: v4(),
    })
    poemPropertyList.push({
      text: getRandomPoem(),
      distance: 1,
      quadrant: "bottomRight",
      zoomDirection,
      id: v4(),
    })
  }

  const convertPropertyListToComponentList = () => {
    const newComponentList:ReactNode[] = []
    poemPropertyList.forEach((poemProperty, index) => {
      // if this is the currently-enlarged poem, it is unpressable
      const onPress = poemProperty.distance !== 0 ? () => pressPoem(index) : undefined
      const poemComponent = (
        <View style={poemContainer} key={poemProperty.id}>
          <ZoomedCorner
            distanceFromViewer={poemProperty.distance}
            zoomDirection={poemProperty.zoomDirection}
            quadrant={poemProperty.quadrant}
          >
            <StyledText type="body" onPress={onPress}>
              {poemProperty.text}
            </StyledText>
          </ZoomedCorner>
        </View>
      )
      newComponentList.push(poemComponent)
    })
    setPoemComponentList(newComponentList)
  }

  // one of the corner poems is pressed
  const pressPoem = useCallback((poemNumber: number) => {
    const newDirection = oppositeDirection(poemPropertyList[poemNumber].quadrant)
    // now go through and update the distance of all the on-screen poems
    // we go backwards because we are splicing
    let index = poemPropertyList.length
    while (index--) {
      const poemProperty = poemPropertyList[index]
      poemProperty.zoomDirection = newDirection
      // this is the one pressed, zoom it into the center
      if (index === poemNumber) {
        poemProperty.distance = 0
      }
      // this one is off the screen already so we can remove it
      else if (poemProperty.distance === -1) {
        poemPropertyList.splice(index, 1);
      }
      // otherwise zoom it out of the screen
      else {
        poemProperty.distance = -1
      }
    }
    // now refill the empty slots
    pushNewPoems(newDirection)
    // and update the component list
    convertPropertyListToComponentList()
  }, [])

  // initiate poem state
  useEffect(() => {
    pushNewPoems("bottomRight")
    convertPropertyListToComponentList()
  }, [])
  

  return (
    <Flex full centered>
      { poemComponentList }
    </Flex>
  )
};
