import React from "react";
import { Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAppSelector } from "../state/hooks";
import { getAuthData } from "../state/reducers/authSlice";
import { getstoriesData } from "../state/reducers/storiesSlice";

const Reaction = ({ reaction, item, handleReactions, handleOnpress }: any) => {
  const { user } = useAppSelector(getAuthData);
  const { IvotedData } = useAppSelector(getstoriesData);

  let icon;
  let name;
  let color;

  switch (reaction) {
    case "applauds":
      icon = "hand-clap";
      name = "applauds";
      color = item["applauds"].includes(user.id) ? "#73481c" : "#707070";
      break;
    case "compassions":
      icon = "heart";
      name = "compassions";
      color = item["compassions"].includes(user.id) ? "#4c0000" : "#707070";
      break;
    case "brokens":
      icon = "heart-broken";
      name = "brokens";
      color = item["brokens"].includes(user.id) ? "#5900b2" : "#707070";
      break;
    case "justNos":
      icon = "trending-down";
      name = "justNos";
      color = item["justNos"].includes(user.id) ? "#305a63" : "#707070";
      break;
    default:
      icon = "comments";
      name = "numOfComments";
      color = "#707070";
      break;
  }
  return (
    <TouchableOpacity
      onPress={() =>
        name === "numOfComments"
          ? handleOnpress(item)
          : handleReactions({ item, reaction: name })
      }
      style={{ flexDirection: "row" }}
    >
      {reaction === "comments" ? (
        <FontAwesome name={icon} color={color} size={28} />
      ) : (
        <MaterialCommunityIcons name={icon} color={color} size={28} />
      )}
      {(reaction !== "comments"
        ? item[name].length !== 0
        : item[name] !== 0) && (
        <Text style={{ color: "#9db0c0", fontSize: 11 }}>
          {reaction !== "comments" ? item[name].length : item[name]}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Reaction;
