import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import StoryModal from "../StoryModal";
import {
  getstoriesData,
  loadStories,
  reloadInitialData,
} from "../state/reducers/storiesSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeadOfStory from "../Story/HeadOfStory";
import BodyOfStory from "../Story/BodyOfStory";
import FooterOfStory from "../Story/FooterOfStory";
import { getAuthData } from "../state/reducers/authSlice";

const Items = () => {
  const dispatch = useAppDispatch();
  const { reloadState } = useAppSelector(getstoriesData);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const result = async () => await AsyncStorage.getItem("myStoredDataRandom");

  useEffect(() => {
    setLoading(true),
      result()
        .then((res) => setData(JSON.parse(res)))
        .then(() => dispatch(reloadInitialData(false)))
        .then(() => setLoading(false));
  }, [reloadState]);

  const onRefresh = async () => {
    dispatch(loadStories());
    dispatch(reloadInitialData(true));
    setIsRefreshing(true);
    result()
      .then((res) => setData(JSON.parse(res)))
      .then(() => dispatch(reloadInitialData(false)));
    setIsRefreshing(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            transform: [{ scale: 3 }],
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <HeadOfStory item={item} />
              <BodyOfStory item={item} />
              <FooterOfStory item={item} />
              <View
                style={{
                  borderBottomColor: "grey",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  marginTop: 15,
                }}
              />
            </View>
          )}
          keyExtractor={(item) => {
            return item.id;
          }}
        />
      )}
      <View style={{ flex: 1 }}>
        <StoryModal />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#051e28",
  },

  item: {
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 22,
    color: "#bcbcbc",
    marginBottom: 25,
    marginHorizontal: 32,
  },

  icon: {
    position: "absolute",
    display: "flex",
    flexDirection: "column-reverse",
    backgroundColor: "#0782F9",
  },
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

export default Items;
