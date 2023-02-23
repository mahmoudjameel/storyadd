import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData } from "./state/reducers/authSlice";
import {
  addStories,
  getstoriesData,
  getStory,
  loadStories,
  reloadInitialData,
  updateStories,
  updateStoriesState,
} from "./state/reducers/storiesSlice";
import { useNavigation, useRoute } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const StoryModal = (item) => {
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState(item && item.item ? item.item.title : "");
  const [content, setContent] = useState(
    item && item.content ? item.item.content : ""
  );
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const { user } = useAppSelector(getAuthData);
  const { story } = useAppSelector(getstoriesData);
  const pageName = useRoute().name;
  const navigation = useNavigation<any>();

  let original = { story };

  let { story: clonedItem } = original;
  let cloned = { ...clonedItem };

  const handleStory = async () => {
    setLoading(true);
    pageName !== "item"
      ? content !== "" && title !== ""
        ? dispatch(addStories({ title, userId: user.id, content }))
            .then(({ payload }: any) => dispatch(getStory(payload.id)))
            .then(() =>
              setTimeout(() => {
                setStatus("success");
              }, 50)
            )
            .then(() => (setContent(""), setTitle("")))
        : title === "" && content !== ""
        ? setTitleError(true)
        : title !== "" && content === ""
        ? setContentError(true)
        : (setTitleError(true), setContentError(true))
      : dispatch(
          updateStories({
            title: title !== "" ? title : item && item.item && item.item.title,
            storyId: item.item.id,
            content:
              content !== "" ? content : item && item.item && item.item.content,
          })
        )
          .then(() => dispatch(getStory(item.item.id)))
          .then(() => (setStatus("success"), setContent(""), setTitle("")));
  };

  useEffect(() => {
    !modalVisible &&
      (setTitleError(false),
      setContentError(false),
      setContent(""),
      setTitle(""));
  }, [modalVisible]);

  useEffect(() => {
    status === "success" &&
      setTimeout(() => {
        setLoading(false);
        setModalVisible(!modalVisible);
        setStatus("ready");

        dispatch(loadStories()).then(() => dispatch(reloadInitialData(true)));

        pageName !== "item"
          ? navigation.navigate("item", { item: cloned })
          : navigation.navigate("item", { item: cloned });
      }, 50);
  }, [status]);

  return (
    <View style={styles.centeredView}>
      {modalVisible && <StatusBar hidden />}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: -30,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            height: windowHeight + 30,
          }}
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={titleError ? "required title" : "Give it a title"}
                placeholderTextColor={titleError ? "red" : "#8BBCCC"}
                onChangeText={(text) => setTitle(text)}
                style={styles.input}
                maxLength={70}
                defaultValue={
                  Object.entries(item).length !== 0 ? item.item.title : ""
                }
              />
              <TextInput
                multiline
                numberOfLines={8}
                placeholder={
                  contentError ? "required content" : "Write your story here..."
                }
                placeholderTextColor={contentError ? "red" : "#8BBCCC"}
                onChangeText={(text) => setContent(text)}
                style={styles.input}
                defaultValue={
                  Object.entries(item).length !== 0 ? item.item.content : ""
                }
              />
              <TouchableOpacity
                onPress={handleStory}
                style={styles.buttonSendContainer}
              >
                {!loading ? (
                  <Text
                    style={[
                      styles.buttonSend,
                      {
                        backgroundColor: "#748DA6",
                      },
                    ]}
                  >
                    Send
                  </Text>
                ) : (
                  <View
                    style={[
                      {
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        borderRadius: 50,
                        elevation: 4,
                        marginTop: 16,
                        padding: 6,
                      },
                    ]}
                  >
                    <ActivityIndicator size="large" />
                    <Text>Processing story...</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <Pressable
              style={[styles.buttonClose]}
              onPress={() => (
                setModalVisible(!modalVisible), setStatus("ready")
              )}
            >
              <AntDesign
                style={styles.textStyle}
                name="close"
                size={30}
                color="#646464"
              />
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={
          pageName === "item"
            ? { opacity: modalVisible ? 0 : 1, bottom: 20, left: 20 }
            : [styles.buttonOpen, { opacity: modalVisible ? 0 : 1 }]
        }
        onPress={() => setModalVisible(true)}
      >
        {pageName !== "item" ? (
          <AntDesign
            style={styles.textStyle}
            name="plus"
            size={29}
            color="#646464"
          />
        ) : (
          <Feather name="edit" color={"#244f76"} size={24} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#5b6c8f",
    borderRadius: 20,
    width: windowWidth * 0.98,
    paddingVertical: 50,
    paddingHorizontal: 17,
  },

  buttonOpen: {
    backgroundColor: "#495C83",
    borderRadius: 50,
    padding: 26,
    elevation: 4,
    position: "absolute",
    right: 20,
    bottom: 50,
  },
  buttonClose: {
    backgroundColor: "#495C83",
    position: "absolute",
    right: 12,
    top: 12,
    borderRadius: 50,
    elevation: 50,
    padding: 3,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "#144272",
    color: "#EAFDFC",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    fontSize: 18,
  },
  buttonSendContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSend: {
    borderRadius: 50,
    elevation: 4,
    top: 16,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
});

export default StoryModal;
