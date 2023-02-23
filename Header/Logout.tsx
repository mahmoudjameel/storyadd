import { signOut } from "firebase/auth";
import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { resetUser } from "../state/reducers/authSlice";

const Logout = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={() => {
        signOut(auth)
          .then(() => {
            setTimeout(() => {
              dispatch(resetUser({}));
              navigation.replace("login", "noSplash");
            }, 1000);
          })
          .catch((error) => alert(error.message));
      }}
    >
      <AntDesign name="logout" size={28} color="#646464" />
    </TouchableOpacity>
  );
};

export default Logout;

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    right: 7,
    backgroundColor: "red",
  },
  button: {
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    color: "#646464",
    fontSize: 24,
  },
});
