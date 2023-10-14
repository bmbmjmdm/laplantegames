import { Animated, View } from "react-native";
import React, {
  FunctionComponent,
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  useContext,
} from "react";
import { easeOutBack } from "../Components";
import phone_case from "../assets/phone_case.png";
import phone_inner from "../assets/phone_inner.png";
import { ThemeContext } from "../Theme";

type SlideshowPhoneProps = {
  pictureLists: any[][];
  curListRef: MutableRefObject<boolean>;
  onFirstCycleComplete: () => void;
};

// This component animates a phone cycling through a list of images/gifs
// You'll see constants used in various equations below. These are relative sizes to ensure that all the images appear in the correct proportions
export const SlideshowPhone: FunctionComponent<SlideshowPhoneProps> = ({
  pictureLists,
  curListRef,
  onFirstCycleComplete,
}) => {
  // we need to convert our boxed boolean into a boxed number
  const curListNum = () => (curListRef.current ? 1 : 0);
  const theme = useContext(ThemeContext);
  const prevListRef = useRef(curListNum());
  const [phoneCycling, setPhoneCycling] = useState(false);
  const finalPhoneScale = theme.phoneScaleFinal;
  const basePhoneHeight = theme.phoneHeight;
  const defaultPhoneHeight = 1232;
  const phoneHeightRatio = basePhoneHeight / defaultPhoneHeight;
  const basePhoneWidth = 572 * phoneHeightRatio;
  const heightPhoneAtScale = basePhoneHeight * finalPhoneScale;
  const widthPhoneAtScale = basePhoneWidth * finalPhoneScale;
  const heightAppAtScale = 1050 * phoneHeightRatio * finalPhoneScale;
  const widthAppAtScale = (520 / 572) * basePhoneWidth * finalPhoneScale;

  // we use 2 app screens, one on top of the other, so we can animate the new one in and the old one out, then they swap roles
  const curApp = useRef(0);
  const [curPicOneState, setCurPicOneSetter] = useState(0);
  const [curPicTwoState, setCurPicTwoSetter] = useState(1);
  const innerPhoneOpacity = useRef(new Animated.Value(1)).current;
  const startingTopVal = 250 * phoneHeightRatio;
  const startingScaleVal = theme.appScaleInitial;
  const appScreens = [
    {
      picList: useRef(pictureLists[curListNum()]),
      picOpacity: useRef(new Animated.Value(0)).current,
      picTop: useRef(new Animated.Value(startingTopVal)).current,
      picZ: useRef(new Animated.Value(1)).current,
      picScale: useRef(new Animated.Value(startingScaleVal)).current,
      curPic: curPicOneState,
      setCurPic: setCurPicOneSetter,
    },
    {
      picList: useRef(pictureLists[curListNum()]),
      picOpacity: useRef(new Animated.Value(0)).current,
      picTop: useRef(new Animated.Value(startingTopVal)).current,
      picZ: useRef(new Animated.Value(2)).current,
      picScale: useRef(new Animated.Value(startingScaleVal)).current,
      curPic: curPicTwoState,
      setCurPic: setCurPicTwoSetter,
    },
  ];

  // cycle through our apps
  useEffect(() => {
    const curAppScreen = appScreens[curApp.current];
    const nextAppScreen = appScreens[1 - curApp.current];
    // optionally fade out the inner phone if we just started cycling
    const optionalAnimation = phoneCycling
      ? []
      : [
          Animated.timing(innerPhoneOpacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: false,
          }),
        ];
    Animated.parallel([
      ...optionalAnimation,
      // fade out old image
      Animated.timing(curAppScreen.picOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
      // fade in new image
      Animated.timing(nextAppScreen.picOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
      // slide new image into position
      Animated.timing(nextAppScreen.picTop, {
        toValue: 0,
        easing: easeOutBack,
        duration: 600,
        useNativeDriver: false,
      }),
      // scale up new image to full size
      Animated.timing(nextAppScreen.picScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // now set them up to do it again next time
      setPhoneCycling(true);
      onFirstCycleComplete();
      setTimeout(() => {
        nextAppScreen.picZ.setValue(1);
        curAppScreen.picZ.setValue(2);
        curAppScreen.picScale.setValue(startingScaleVal);
        curAppScreen.picTop.setValue(startingTopVal);
      }, 500);
    });
    setTimeout(() => {
      // we switch over the picture lists here to ensure it doesnt conflict with the animation
      if (curListNum() !== prevListRef.current) {
        curAppScreen.picList.current = pictureLists[curListNum()];
      }
      // go to the next picture (by 2 so the 2 app screens leap frog each other)
      // if we go off the end of the list, reset to our original index
      if (curAppScreen.curPic + 2 > curAppScreen.picList.current.length - 1) {
        curAppScreen.setCurPic(curApp.current);
      } else {
        curAppScreen.setCurPic(curAppScreen.curPic + 2);
      }
      curApp.current = 1 - curApp.current;
      // every X seconds change the picture/gif
    }, theme.appCycleTime * 1000);
  }, [curPicOneState, curPicTwoState]);

  // render the phone and the apps
  return (
    <View
      style={{
        overflow: "hidden",
        zIndex: 1,
        borderRadius: 51 * phoneHeightRatio,
        width: widthPhoneAtScale,
        height: heightPhoneAtScale,
      }}
    >
      <Animated.Image
        style={{
          width: widthPhoneAtScale,
          zIndex: 3,
          height: heightPhoneAtScale,
        }}
        source={phone_case}
      />
      {!phoneCycling && (
        <Animated.Image
          style={{
            position: "absolute",
            width: widthPhoneAtScale,
            zIndex: 0,
            opacity: innerPhoneOpacity,
            height: heightPhoneAtScale,
          }}
          source={phone_inner}
        />
      )}
      <Animated.Image
        style={{
          position: "absolute",
          width: widthAppAtScale,
          height: heightAppAtScale,
          zIndex: appScreens[0].picZ,
          top: 40 * phoneHeightRatio,
          left: 15 * phoneHeightRatio,
          opacity: appScreens[0].picOpacity,
          transform: [
            { translateY: appScreens[0].picTop },
            { scale: appScreens[0].picScale },
          ],
        }}
        source={appScreens[0].picList.current[appScreens[0].curPic]}
      />
      <Animated.Image
        style={{
          position: "absolute",
          width: widthAppAtScale,
          height: heightAppAtScale,
          zIndex: appScreens[1].picZ,
          top: 40 * phoneHeightRatio,
          left: 15 * phoneHeightRatio,
          opacity: appScreens[1].picOpacity,
          transform: [
            { translateY: appScreens[1].picTop },
            { scale: appScreens[1].picScale },
          ],
        }}
        source={appScreens[1].picList.current[appScreens[1].curPic]}
      />
    </View>
  );
};
