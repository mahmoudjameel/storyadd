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
  getcommentsData,
  loadcomments,
  addcomments,
  removeComment,
  addCommentLike,
  addCommentDislike,
  loadAllComments,
} from "./state/reducers/commentsSlice";
import Entypo from "@expo/vector-icons/Entypo";
import {} from "./state/reducers/repliesSlice";
import {
  addCommentNumberToStory,
  substractCommentNumberToStory,
} from "./state/reducers/storiesSlice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useIsFocused } from "@react-navigation/native";
import FooterOfStory from "./Story/FooterOfStory";
import HeadOfStory from "./Story/HeadOfStory";
import BodyOfStory from "./Story/BodyOfStory";
import moment from "moment";

const Item = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const ccc = route.params;
  const { user } = useAppSelector(getAuthData);
  const { result } = useAppSelector(getcommentsData);
  const [commentIdLoading, setCommentIdLoading] = useState("");
  const [comment, setComment] = useState("");
  const [commentIdDelete, setCommentIdDelete] = useState(false);
  const [deleteComment, setDeleteComment] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [disLikeLoading, setDisLikeLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isFocused && dispatch(loadcomments(ccc.item.id));
  }, [isFocused]);

  const handleComment = async () => {
    setLoading(true);
    dispatch(
      addcomments({
        comment: comment,
        userId: user.id,
        storyId: ccc.item.id,
        likes: [],
        dislikes: [],
        numOfReplies: 0,
      })
    )
      .then(() =>
        dispatch(
          addCommentNumberToStory({
            storyId: ccc.item.id,
            numOfComments: result.length,
          })
        )
      )
      .then(() => setComment(""))
      .then(() => Keyboard.dismiss());
    setTimeout(() => {
      dispatch(loadcomments(ccc.item.id))
        .then(() => dispatch(loadAllComments(ccc.item.id)))
        .then(() => setLoading(false));
    }, 250);
  };

  const handleOnpress = (item) => {
    navigation.navigate("reply", { item: item });
    setSelectedId(item.id);
  };

  const handleLike = (item) => {
    setCommentIdLoading(item.id);
    setLikeLoading(true);
    const commentLikesData = {
      commentId: item.id,
      liker: user.id,
      storyId: item.storyId,
    };
    const commentLikesArray = [...item.likes];
    const commentDislikesData = { commentId: item.id, liker: user.id };
    const commentDislikesArray = [...item.dislikes];

    item.likes.filter((zzz) => zzz.liker === user.id).length === 0
      ? commentLikesArray.push(commentLikesData)
      : commentLikesArray.pop();

    item.dislikes.filter((zzz) => zzz.liker === user.id).length !== 0 &&
      commentDislikesArray.pop();
    dispatch(
      addCommentDislike({
        commentDislikesData,
        commentDislikesArray,
      })
    );
    dispatch(
      addCommentLike({
        commentLikesData,
        commentLikesArray,
      })
    );
    dispatch(loadcomments(ccc.item.id));
    setLikeLoading(false);
  };

  const handleDislike = (item) => {
    setDisLikeLoading(true);
    setCommentIdLoading(item.id);
    const commentDislikesData = { commentId: item.id, liker: user.id };
    const commentDislikesArray = [...item.dislikes];
    const commentLikesData = { commentId: item.id, liker: user.id };
    const commentLikesArray = [...item.likes];

    item.likes.filter((zzz) => zzz.liker === user.id).length !== 0 &&
      commentLikesArray.pop();

    item.dislikes.filter((zzz) => zzz.liker === user.id).length === 0
      ? commentDislikesArray.push(commentDislikesData)
      : commentDislikesArray.pop();
    dispatch(
      addCommentLike({
        commentLikesData,
        commentLikesArray,
      })
    );
    dispatch(
      addCommentDislike({
        commentDislikesData,
        commentDislikesArray,
      })
    );
    dispatch(loadcomments(ccc.item.id));
    setDisLikeLoading(false);
  };

  const handleRemove = (item) => {
    setCommentIdDelete(item.id);
    shake();
    setDeleteComment(true);
    dispatch(removeComment(item.id)).then(() =>
      dispatch(
        substractCommentNumberToStory({
          storyId: ccc.item.id,
          numOfComments: result.length,
        })
      )
    );
    dispatch(loadcomments(ccc.item.id)).then(() => setDeleteComment(false));
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

  const getHeader = (storyId) => (
    <View>
      <HeadOfStory item={ccc.item} />
      <BodyOfStory item={ccc.item} />
      <FooterOfStory item={ccc.item} />
      <View
        style={{
          marginTop: 15,
          paddingTop: 15,
          paddingBottom: 10,
          borderTopColor: "grey",
          borderTopWidth: StyleSheet.hairlineWidth,
        }}
      >
        <Text
          style={{
            color: "#7f6c33",
            fontSize: 14,
            marginLeft: 5,
            marginTop: 5,
            fontFamily: "",
            fontWeight: "700",
            borderColor: "#7f6c33",
            borderWidth: 1,
            width: "25%",
            padding: 7,
            borderRadius: 8,
          }}
        >
          Comments :
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={{ marginBottom: 90 }}
        data={result}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <TouchableOpacity
              onPress={() => (
                dispatch(getUser(item.commenter)),
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
              <Text
                style={{
                  color: "#476700",
                  marginHorizontal: 10,
                  fontSize: 12,
                }}
              >
                {moment(new Date(item.timestamp)).fromNow()}
              </Text>
            </TouchableOpacity>
            <Text style={styles.comment}>{item.comment}</Text>
            <View style={styles.commentActions}>
              <TouchableOpacity
                onPress={() => {
                  handleOnpress(item);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 15,
                    width: 110,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#9BA5A9",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    Reply
                  </Text>
                  {item.numOfReplies !== 0 && (
                    <Text
                      style={{
                        color: "#727577",
                        fontSize: 15,
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      / view
                    </Text>
                  )}
                  <Text style={{ color: "white", padding: 0, margin: 0 }}>
                    {item.numOfReplies}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleLike(item);
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {likeLoading && item.id === commentIdLoading ? (
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
                  {disLikeLoading && item.id === commentIdLoading ? (
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
                style={{ opacity: user.id === item.commenter ? 1 : 0 }}
                disabled={user.id !== item.commenter && true}
              >
                {deleteComment && item.id === commentIdDelete ? (
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
          onChangeText={(text) => setComment(text)}
          placeholder="  Add a comment ..."
          placeholderTextColor={"#8BBCCC"}
          value={comment}
        />
        <TouchableOpacity
          onPress={handleComment}
          style={styles.button}
          disabled={comment === "" && true}
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
    paddingBottom: 20,
    minHeight: 200,
  },
  commentResponseContainer: {
    borderTopWidth: 1,
    borderTopColor: "#1E343E",
  },
  commentContainer: {
    flexDirection: "column",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  comment: {
    fontSize: 18,
    color: "#9BA5A9",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
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
    // backgroundColor: "green",
  },
  miniLogo: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  postComment: {
    // // flex: 0,
    // flexDirection: "row",
    // // position: "absolute",
    // // bottom: 10,
    // alignItems: "center",
    // justifyContent: "space-around",
    // // width: "100%",
    // // marginHorizontal: -10,
    // backgroundColor: "#051E28",
  },
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

    // width: "90%",
    color: "#8BBCCC",
  },
  button: {
    // backgroundColor: "#052821",
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

export default React.memo(Item);
