import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation, StackActions } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";

const MenuButton = () => {
  const navigation = useNavigation<any>();

  const route = useRoute();

  const popAction = StackActions.pop(1);

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={() => {
          {
            [
              "items",
              "compassions",
              "brokens",
              "justNos",
              "timestamp",
              "applauds",
            ].includes(route.name)
              ? navigation.openDrawer()
              : navigation.dispatch(popAction);
          }
        }}
        style={styles.button}
      >
        {[
          "items",
          "compassions",
          "brokens",
          "justNos",
          "timestamp",
          "applauds",
        ].includes(route.name) ? (
          <Entypo name="menu" size={38} color="#646464" />
        ) : (
          <AntDesign name="left" size={30} color="#646464" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default MenuButton;

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  button: {
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
  },
  modal: {
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    border: 5,
    borderColor: "black",
    height: "100%",
    backgroundColor: "blue",
    transform: [{ translateX: 50 }],
  },
});
