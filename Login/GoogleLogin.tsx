import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React from "react";
import { useEffect } from "react";
import { useIdTokenAuthRequest } from "expo-auth-session/build/providers/Google";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const GoogleLogin = () => {
  const [request, response, promptAsync] = useIdTokenAuthRequest({
    clientId:
      "1021244246830-cmm9qsumrlkfm44i0roc05rdg3r5tpnp.apps.googleusercontent.com",
    androidClientId:
      "1021244246830-tfceehah9b4k9fattb4ucsdgtcnpqbrq.apps.googleusercontent.com",
  });

  const PicId = () => {
    return Math.floor(Math.random() * 1084);
  };
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const auth = getAuth();
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then(async (cred) => {
        const q = query(
          collection(db, "users"),
          where("firebaseUserId", "==", cred.user.uid)
        );
        const querySnapshot = (await getDocs(q)).docs.length;

        try {
          querySnapshot === 0 &&
            (await addDoc(collection(db, "users"), {
              username: cred.user.displayName,
              firebaseUserId: cred.user.uid,
              writer: cred.user.email,
              timestamp: Date.now(),
              avatar: `https://picsum.photos/id/${PicId()}/200/300`,
            }));
        } catch (e) {
          console.error("Error adding document: ", e);
          Alert.alert("action failed please try again");
        }
      });
    }
  }, [response]);
  return (
    <TouchableOpacity
      onPress={() => {
        promptAsync();
      }}
      style={styles.button3}
      disabled={!request}
    >
      <Text style={styles.buttonText}>Login with Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#051e28",
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  inputContainer: {
    width: "60%",
  },
  input: {
    backgroundColor: "#144272",
    color: "#EAFDFC",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button1: {
    backgroundColor: "#292FBF",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
    borderColor: "#0F3460",
    borderWidth: 1,
  },
  button2: {
    backgroundColor: "#2A3FA0",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 12,
    borderColor: "#0F3460",
    borderWidth: 1,
  },
  button3: {
    backgroundColor: "#16213E",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 12,
    alignItems: "center",
    borderColor: "#0F3460",
    borderWidth: 1,
  },

  button4: {
    backgroundColor: "#182747",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 12,
    alignItems: "center",
    borderColor: "#0F3460",
    borderWidth: 1,
  },

  buttonText: {
    color: "#8BBCCC",
    fontWeight: "700",
    fontSize: 16,
  },
});
