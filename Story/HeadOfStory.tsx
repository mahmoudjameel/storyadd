import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useRef } from "react";
import { Text, TouchableOpacity, Image, Animated, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { getAuthData, getUser } from "../state/reducers/authSlice";
import { removeStory } from "../state/reducers/storiesSlice";
import { useRoute } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import StoryModal from "../StoryModal";
import moment from "moment";

const HeadOfStory = ({ item }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { user } = useAppSelector(getAuthData);
  const route = useRoute();

  const handleNavigation = () => {
    setTimeout(() => {
      dispatch(getUser(item.writerId));
      navigation.navigate("profile", { notActualUser: true });
    }, 50);
  };

  const anim = useRef(new Animated.Value(0));

  const shake = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim.current, {
          toValue: -2,
          useNativeDriver: false,
          duration: 80,
        }),
        Animated.timing(anim.current, {
          toValue: 2,
          useNativeDriver: false,
          duration: 80,
        }),
        Animated.timing(anim.current, {
          toValue: 0,
          useNativeDriver: false,
          duration: 80,
        }),
      ]),
      { iterations: 2 }
    ).start();
  }, []);

  const handleRemoveStory = (item) => {
    shake();
    dispatch(removeStory({ storyId: item.id })).then(() =>
      navigation.navigate("items")
    );
  };

  return (
    <TouchableOpacity
      onPress={handleNavigation}
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri: item.avatar,
        }}
        style={{
          width: 30,
          height: 30,
          borderRadius: 50,
          marginHorizontal: 10,
          marginVertical: 18,
        }}
      />
      <Text style={{ fontSize: 16, color: "white" }}>{item.username}</Text>
      <Text
        style={{
          color: "#476700",
          marginHorizontal: 10,
          fontSize: 12,
        }}
      >
        {moment(new Date(item.timestamp)).fromNow()}
      </Text>

      {route.name === "item" && item.writerId === user.id && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            flex: 1,
            marginHorizontal: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <StoryModal item={item} />
          </View>

          <Animated.View style={{ transform: [{ translateX: anim.current }] }}>
            <MaterialCommunityIcons
              onPress={() => handleRemoveStory(item)}
              name="delete-empty"
              color={"#669393"}
              size={28}
            />
          </Animated.View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default HeadOfStory;
