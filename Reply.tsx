import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Animated,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, getUser } from "./state/reducers/authSlice";
import {
  getrepliesData,
  loadreplies,
  addreplies,
  removereply,
  addreplyLike,
  addreplyDislike,
} from "./state/reducers/repliesSlice";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  addReplyNumberToComment,
  substractReplyNumberToComment,
} from "./state/reducers/commentsSlice";
import moment from "moment";

const Reply = ({ navigation, route }) => {
  const ccc = route.params;
  const { user } = useAppSelector(getAuthData);

  const [replyIdLoading, setreplyIdLoading] = useState("");

  const [replyIdDelete, setreplyIdDelete] = useState(false);
  const [reply, setreply] = useState("");
  const [deletereply, setDeletereply] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [disLikeLoading, setDisLikeLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useAppDispatch();
  const { result } = useAppSelector(getrepliesData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(loadreplies(ccc.item.id));
  }, []);

  const handlereply = async () => {
    setLoading(true);
    dispatch(
      addreplies({
        reply: reply,
        userId: user.id,
        commentId: ccc.item.id,
        likes: [],
        dislikes: [],
      })
    )
      .then(() =>
        dispatch(
          addReplyNumberToComment({
            commentId: ccc.item.id,
            numOfReplies: result.length,
          })
        )
      )
      .then(() => setreply(""))
      .then(() => Keyboard.dismiss());

    setTimeout(() => {
      dispatch(loadreplies(ccc.item.id)).then(() => setLoading(false));
    }, 250);
  };

  const handleLike = (item) => {
    setreplyIdLoading(item.id);
    setLikeLoading(true);
    const replyLikesData = { replyId: item.id, liker: user.id };
    const replyLikesArray = [...item.likes];
    const replyDislikesData = { replyId: item.id, liker: user.id };
    const replyDislikesArray = [...item.dislikes];

    item.likes.filter((zzz) => zzz.liker === user.id).length === 0
      ? replyLikesArray.push(replyLikesData)
      : replyLikesArray.pop();

    item.dislikes.filter((zzz) => zzz.liker === user.id).length !== 0 &&
      replyDislikesArray.pop();
    dispatch(
      addreplyDislike({
        replyDislikesData,
        replyDislikesArray,
      })
    ).then(() =>
      dispatch(
        addreplyLike({
          replyLikesData,
          replyLikesArray,
        })
      )
        .then(() => dispatch(loadreplies(ccc.item.id)))
        .then(() => setLikeLoading(false))
    );
  };

  const handleDislike = (item) => {
    setDisLikeLoading(true);
    setreplyIdLoading(item.id);
    const replyDislikesData = { replyId: item.id, liker: user.id };
    const replyDislikesArray = [...item.dislikes];
    const replyLikesData = { replyId: item.id, liker: user.id };
    const replyLikesArray = [...item.likes];

    item.likes.filter((zzz) => zzz.liker === user.id).length !== 0 &&
      replyLikesArray.pop();

    item.dislikes.filter((zzz) => zzz.liker === user.id).length === 0
      ? replyDislikesArray.push(replyDislikesData)
      : replyDislikesArray.pop();

    dispatch(
      addreplyLike({
        replyLikesData,
        replyLikesArray,
      })
    ).then(() =>
      dispatch(
        addreplyDislike({
          replyDislikesData,
          replyDislikesArray,
        })
      )
        .then(() => dispatch(loadreplies(ccc.item.id)))
        .then(() => setDisLikeLoading(false))
    );
  };

  const handleRemove = (item) => {
    setreplyIdDelete(item.id);
    shake();
    setDeletereply(true);
    dispatch(removereply(item.id))
      .then(() =>
        dispatch(
          substractReplyNumberToComment({
            commentId: ccc.item.id,
            numOfReplies: result.length,
          })
        )
      )
      .then(() =>
        dispatch(loadreplies(ccc.item.id)).then(() => setDeletereply(false))
      );
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

  const getHeader = () => {
    return (
      <View style={styles.subContainer}>
        <TouchableOpacity
          onPress={() => (
            dispatch(getUser(ccc.item.commenter)),
            navigation.navigate("profile", { notActualUser: true })
          )}
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: ccc.item.avatar,
            }}
            style={{
              width: 30,
              height: 30,
              borderRadius: 50,
              marginHorizontal: 10,
              marginVertical: 18,
            }}
          />
          <Text style={{ fontSize: 16, color: "white" }}>
            {ccc.item.username}
          </Text>
          <Text
            style={{
              color: "#476700",
              marginHorizontal: 10,
              fontSize: 12,
            }}
          >
            {moment(new Date(ccc.item.timestamp)).fromNow()}
          </Text>
        </TouchableOpacity>
        <Text style={styles.content}>
          {"\t"}

          {ccc.item.comment}
        </Text>
        <View
          style={{
            borderBottomColor: "grey",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text
          style={{
            color: "#7f6c33",
            fontSize: 14,
            marginLeft: 5,
            marginTop: 10,
          }}
        >
          Replies :
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ marginBottom: 90 }}
        data={result}
        renderItem={({ item }) => (
          <View style={styles.replyContainer}>
            <TouchableOpacity
              onPress={() => (
                dispatch(getUser(item.replier)),
                navigation.navigate("profile", { notActualUser: true })
              )}
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
                  marginHorizontal: 0,
                  marginVertical: 0,
                }}
              />
              <Text style={{ fontSize: 16, color: "white", marginLeft: 8 }}>
                {item.username}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: "#476700",
                marginHorizontal: 10,
                // marginLeft: 70,
                fontSize: 12,
              }}
            >
              {moment(new Date(item.timestamp)).fromNow()}
            </Text>
            <Text style={styles.reply}>{item.reply}</Text>
            <View style={styles.replyActions}>
              <TouchableOpacity
                onPress={() => {
                  handleLike(item);
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {likeLoading && item.id === replyIdLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Entypo
                      name="arrow-bold-up"
                      color={
                        item.likes.filter((zzz) => zzz.liker === user.id)
                          .length !== 0
                          ? "#6a4e7e"
                          : "#3d4c57"
                      }
                      size={26}
                      style={{ transform: [{ rotate: "40deg" }] }}
                    />
                  )}
                  <Text style={{ color: "white" }}>{item.likes.length}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleDislike(item);
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {disLikeLoading && item.id === replyIdLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Entypo
                      name="arrow-bold-down"
                      color={
                        item.dislikes.filter((zzz) => zzz.liker === user.id)
                          .length === 0
                          ? "#3d4c57"
                          : "#6a4e7e"
                      }
                      size={26}
                      style={{ transform: [{ rotate: "40deg" }] }}
                    />
                  )}
                  <Text style={{ color: "white" }}>{item.dislikes.length}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRemove(item)}
                style={{ opacity: user.id === item.replier ? 1 : 0 }}
                disabled={user.id !== item.replier && true}
              >
                {deletereply && item.id === replyIdDelete ? (
                  <Animated.View
                    style={{ transform: [{ translateX: anim.current }] }}
                  >
                    <MaterialCommunityIcons
                      name="delete-empty"
                      color={"#669393"}
                      size={26}
                    />
                  </Animated.View>
                ) : (
                  <MaterialCommunityIcons
                    name="delete"
                    color={"#669393"}
                    size={26}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderBottomColor: "grey",
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
          </View>
        )}
        keyExtractor={(item) => {
          return item.id;
        }}
        extraData={selectedId}
        ListHeaderComponent={getHeader}
      />
      <View
        style={{
          padding: 6,
          elevation: 4,
          position: "absolute",
          right: 0,
          bottom: 0,
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          style={styles.input}
          multiline
          onChangeText={(text) => setreply(text)}
          placeholder="  Add a reply ..."
          placeholderTextColor={"#8BBCCC"}
          value={reply}
        />
        <TouchableOpacity
          onPress={handlereply}
          style={styles.button}
          disabled={reply === "" && true}
        >
          {loading ? (
            <View
              style={[
                {
                  elevation: 4,
                  padding: 3,
                },
              ]}
            >
              <ActivityIndicator size="large" color={"#c5765c"} />
            </View>
          ) : (
            <Text style={styles.buttonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#051e28",
  },
  subContainer: { marginBottom: 10 },
  title: {
    fontSize: 32,
    color: "#CDD2D4",
    padding: 27,
    textAlign: "center",
  },
  content: {
    fontSize: 20,
    color: "#9BA5A9",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  replyResponseContainer: {
    borderTopWidth: 1,
    borderTopColor: "#1E343E",
  },

  replyContainer: {
    flexDirection: "column",

    paddingHorizontal: 20,
    marginTop: 20,
  },
  reply: {
    fontSize: 18,
    color: "#9BA5A9",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  replyActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  responseContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 40,
    marginTop: 10,
  },
  response: {
    fontSize: 20,
    color: "#9BA5A9",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  miniLogo: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  postreply: {},
  input: {
    height: 44,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "#828E94",
    backgroundColor: "#051E28 ",
    borderRadius: 5,
    width: "75%",
    fontSize: 17,
    color: "#8BBCCC",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  buttonText: {
    color: "#c5765c",
    borderWidth: 2,
    borderColor: "#c5765c",
    padding: 8,
    borderRadius: 7,
  },
});

export default Reply;
