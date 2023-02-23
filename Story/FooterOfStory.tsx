import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { getAuthData } from "../state/reducers/authSlice";
import { Ivoted, ReactedToStories, vote } from "../state/reducers/storiesSlice";
import Reaction from "./Reaction";

const FooterOfStory = ({ item }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  const { user } = useAppSelector(getAuthData);

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
  };

  const handleReactions = ({ item, reaction }) => {
    const voteData = {
      voter: user.id,
      story: item,
      reaction,
    };

    dispatch(vote(voteData))
      .then(() => dispatch(Ivoted({ voter: user.id, storyId: item.id })))
      .then(() =>
        setTimeout(() => {
          dispatch(ReactedToStories({ userId: user.id }));
        }, 250)
      );
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      <Reaction
        reaction="applauds"
        item={item}
        handleReactions={handleReactions}
        handleOnpress={handleOnpress}
      />
      <Reaction
        reaction="compassions"
        item={item}
        handleReactions={handleReactions}
        handleOnpress={handleOnpress}
      />
      <Reaction
        reaction="brokens"
        item={item}
        handleReactions={handleReactions}
        handleOnpress={handleOnpress}
      />
      <Reaction
        reaction="justNos"
        item={item}
        handleReactions={handleReactions}
        handleOnpress={handleOnpress}
      />
      <Reaction
        reaction="comments"
        item={item}
        handleReactions={handleReactions}
        handleOnpress={handleOnpress}
      />
    </View>
  );
};

export default React.memo(FooterOfStory);
