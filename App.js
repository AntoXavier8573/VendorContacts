import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform, ScrollView } from "react-native";
import VendorContacts from "./components/VendorContacts";
import CustomText from "./components/controls/CustomText";
import ScrollContainer from "./components/controls/ScrollContainer";

export default function App() {
  return (
    <ScrollContainer>
      <View style={{ width: "100%" }}>
        <CustomText style={styles.pageheader}>Loan Vendor Contacts</CustomText>
        <View style={styles.container}>
          <VendorContacts />
        </View>
        <CustomText style={styles.pagefooter}>Page Bottom</CustomText>
      </View>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "web" ? 20 : 40,
    marginHorizontal: 10,
    minWidth: Platform.OS === "web" ? "98%" : null,
  },
  pagefooter:
    Platform.OS === "web"
      ? {
          position: "relative",
          paddingLeft: "20px",
          paddingTop: "5px",
          backgroundColor: "rgb(48, 126, 204)",
          textAlign: "left",
          clear: "both",
          color: "rgb(255,255, 255)",
          marginBottom: "10px",
          minWidth: "100%",
          paddingBottom: "10px",
        }
      : {
          display: "none",
        },
  pageheader:
    Platform.OS === "web"
      ? {
          backgroundColor: "rgb(48, 126, 204)",
          color: "rgb(255,255, 255)",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "20px",
          fontSize: "20px",
          fontWeight: "bold",
        }
      : {
          display: "none",
        },
});
