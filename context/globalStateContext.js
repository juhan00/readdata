import { createContext, useState, useContext } from "react";
import { POPUP_DEFAULT } from "@/consts/popup";

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    popupState: {
      isOn: false,
      popup: POPUP_DEFAULT,
      title: "",
      content: "",
    },
    userInfo: {
      id: "",
    },
  });

  return <GlobalStateContext.Provider value={[globalState, setGlobalState]}>{children}</GlobalStateContext.Provider>;
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
