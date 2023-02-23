import { StyleSheet, Animated, StatusBar, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const Splash = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnimOut = useRef(new Animated.Value(1)).current;
  const moveAnim = useRef(new Animated.ValueXY({ x: 0, y: 150 })).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }),
      Animated.timing(moveAnim, {
        toValue: { x: 0, y: 0 },
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start();
    setTimeout(() => {
      Animated.timing(fadeAnimOut, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: false,
      }).start();
    }, 2000);
  }, []);

  const boxInterpolation = colorAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [
      "rgb(88, 119, 188)",
      "rgb(154, 221, 211)",
      "rgb(205, 183, 154)",
    ],
  });

  let [fontsLoaded] = useFonts({
    "BebasNeue-Regular": require("./assets/fonts/BebasNeue-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimOut }]}>
      <StatusBar hidden backgroundColor={"#051E28"} />

      <LinearGradient
        colors={["black", "#051E28", "#051E28", "#051E28"]}
        style={[styles.container]}
      >
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: fadeAnim,
              color: boxInterpolation,
              fontFamily: "BebasNeue-Regular",
            },
            moveAnim.getLayout(),
          ]}
        >
          STORYAT
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#435898",
    width: "100%",
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 40,
    letterSpacing: 5,
  },
});
