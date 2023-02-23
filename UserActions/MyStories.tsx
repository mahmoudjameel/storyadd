import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import HeadOfStory from "../Story/HeadOfStory";
import BodyOfStory from "../Story/BodyOfStory";
import FooterOfStory from "../Story/FooterOfStory";
import StoryModal from "../StoryModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

function MyStories() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const storedResult = async () =>
    await AsyncStorage.getItem("myStoredStories");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      storedResult()
        .then((res) => setData(JSON.parse(res)))
        .then(() => setLoading(false));
    }, 350);
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    storedResult().then((res) => setData(JSON.parse(res)));

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
}
export default MyStories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#051e28",
  },

  item: {
    padding: 8,
    marginVertical: 8,
    flex: 1,
  },
  title: {
    fontSize: 22,
    color: "#bcbcbc",
    marginBottom: 25,
    marginHorizontal: 12,
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
