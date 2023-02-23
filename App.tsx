import "react-native-gesture-handler";
import { store } from "./state/store";
import { Provider } from "react-redux";
import Index from "./Index";
import React, { useEffect } from "react";

function App() {
  return (
    <Provider store={store}>
      <Index />
    </Provider>
  );
}

export default App;
