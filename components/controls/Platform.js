import { Platform } from "react-native";

let web = false,
  android = false,
  ios = false;

(web = Platform.OS === "web"),
  (android = Platform.OS === "android"),
  (ios = Platform.OS === "ios");

export { web, android, ios };
