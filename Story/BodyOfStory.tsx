import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

const BodyOfStory = ({ item }: any) => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const [isPending, setIsPending] = useState(false);

  const handleOnpress = (item) => {
    if (isPending) return;
    setIsPending(true);
    navigation.navigate("item", { item: item });
    setIsPending(false);
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          handleOnpress(item);
        }}
      >
        <Text style={[styles.title, { textAlign: "center" }]}>
          {item.title}
        </Text>
        <Text
          style={[styles.content, {}]}
          numberOfLines={route.name !== "item" ? 2 : 250}
        >
          {"\t"} {item.content}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default BodyOfStory;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    color: "#bcbcbc",
    marginTop: 22,
    marginBottom: 0,
    marginHorizontal: 32,
    minHeight: 70,
  },
  content: {
    marginTop: 0,
    marginBottom: 25,
    minHeight: 80,
    marginHorizontal: 10,
    color: "#9fa3a7",
    fontSize: 19,
  },
});
