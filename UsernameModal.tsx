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
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useAppDispatch, useAppSelector } from "./state/hooks";
import {
  getAuthData,
  getUser,
  updateUsername,
  updateUsernameState,
} from "./state/reducers/authSlice";
import { useRoute } from "@react-navigation/native";
import FlashMessage, { showMessage } from "react-native-flash-message";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UsernameModal = () => {
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const { user } = useAppSelector(getAuthData);
  const pageName = useRoute().name;

  const handleUsername = async () => {
    username !== ""
      ? dispatch(updateUsername({ username, userId: user.id }))
          .then(() => setStatus("success"))
          .then(() => dispatch(updateUsernameState(username)))
          .then(() =>
            showMessage({
              message: "Success",
              description: "This edit will be shown in your future visit",
              type: "info",
            })
          )
      : // .then(() => dispatch(getUser(user.id)))
        setUsernameError(true);
  };

  useEffect(() => {
    !modalVisible && (setUsernameError(false), setUsername(""));
  }, [modalVisible]);

  useEffect(() => {
    status === "success" &&
      setTimeout(() => {
        setModalVisible(!modalVisible);
        setStatus("ready");
      }, 2000);
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
                placeholder={
                  usernameError ? "required username" : "Give it a username"
                }
                placeholderTextColor={usernameError ? "red" : "#8BBCCC"}
                onChangeText={(text) => setUsername(text)}
                style={styles.input}
              />

              <TouchableOpacity
                onPress={handleUsername}
                style={styles.buttonSendContainer}
              >
                {status !== "success" ? (
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
                  <Text
                    style={[
                      styles.buttonSend,
                      {
                        backgroundColor: "#68A7AD",
                      },
                    ]}
                  >
                    Succes !
                  </Text>
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
        <FlashMessage position="top" />
      </Modal>
      {/* <Pressable
        style={[styles.buttonOpen, { opacity: modalVisible ? 0 : 1 }]}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign
          style={styles.textStyle}
          name="plus"
          size={30}
          color="#646464"
        />
      </Pressable> */}
      <Pressable
        //   onPress={() => HandleUsername()}
        onPress={() => setModalVisible(true)}
        style={{
          flexDirection: "row",
          // alignItems: "center",
          // justifyContent: "flex-start",
          backgroundColor: "#7f724c",
          paddingHorizontal: 22,
          paddingVertical: 5,
          borderRadius: 5,
          height: 32,
          bottom: 20,
          marginLeft: 8,
        }}
      >
        <MaterialCommunityIcons
          name="pencil-outline"
          color={"white"}
          size={20}
          style={{ color: "white", marginHorizontal: 10 }}
        />
        <Text style={{ color: "white" }}>Update Username</Text>
      </Pressable>
    </View>
  );
};

export default UsernameModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#495C83",
    borderRadius: 20,
    marginTop: 100,
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
