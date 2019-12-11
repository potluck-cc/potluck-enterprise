import { createContext } from "react";

export default createContext({
  user: null,
  activeStore: null,
  setActiveStore: () => {},
  initializeApp: () => {},
  setAuthenticatedUser: () => {},
  demo: false
});
