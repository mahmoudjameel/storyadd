import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Applauds from "../DrawerActions/Applauds";
import JustNos from "../DrawerActions/JustNos";
import Brokens from "../DrawerActions/Brokens";
import Compassions from "../DrawerActions/Compassions";
import Newest from "../DrawerActions/Newest";
import Items from "../DrawerActions/Items";
import {
  getstoriesData,
  loadStories,
  reloadInitialData,
} from "../state/reducers/storiesSlice";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import Title from "./Title";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const Lll = () => {
  const dispatch = useAppDispatch();
  const { resultInitial } = useAppSelector(getstoriesData);

  useEffect(() => {
    let isSubscribed = resultInitial.length === 0 && dispatch(loadStories());
    dispatch(reloadInitialData(true));
    return () => {
      isSubscribed;
    };
  }, []);

  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      screenOptions={{
        header: () => <Title />,
        drawerStyle: { backgroundColor: "#041820" },
        drawerInactiveTintColor: "#9BA5A9",
        swipeEnabled: true,
        headerStyle: { marginTop: 30 },
      }}
    >
      <Drawer.Screen
        name="items"
        component={Items}
        options={{
          title: "Home",
          drawerIcon: () => (
            <FontAwesome5 name="home" color={"#757569"} size={26} />
          ),
        }}
      />
      <Drawer.Screen
        name="timestamp"
        component={Newest}
        options={{
          title: "Trending",
          drawerIcon: () => (
            <Feather name="trending-up" color="#1919a9" size={30} />
          ),
        }}
      />
      <Drawer.Screen
        name="applauds"
        component={Applauds}
        options={{
          title: "Applauded",
          drawerIcon: () => (
            <MaterialCommunityIcons
              name="hand-clap"
              color={"#503213"}
              size={30}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="compassions"
        component={Compassions}
        options={{
          title: "Liked",
          drawerIcon: () => (
            <MaterialCommunityIcons name="heart" color={"#3c0000"} size={30} />
          ),
        }}
      />
      <Drawer.Screen
        name="brokens"
        component={Brokens}
        options={{
          title: "Heart Breaking",
          drawerIcon: () => (
            <MaterialCommunityIcons
              name="heart-broken"
              color={"#3e007c"}
              size={30}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="justNos"
        component={JustNos}
        options={{
          title: "Wow! No",
          drawerIcon: () => (
            <Feather name="trending-down" color="#213e45" size={30} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default Lll;

const styles = StyleSheet.create({
  buttonContainer: { backgroundColor: "#051E28", height: 14 },

  buttonSpace: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: "#051E28",
  },
  buttonContainer1: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#332FD0",
    alignItems: "center",
    height: 80,
    width: 80,
    borderRadius: 50,
    bottom: 5,
  },
  button: {
    color: "yellow",
    fontSize: 32,
  },
});
