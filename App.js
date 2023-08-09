import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Platform, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import {
  handleParamFromURL,
  handleAPI,
} from "./components/controls/CommonFunctions";
import VendorContacts from "./components/VendorContacts";
import CustomText from "./components/controls/CustomText";
import ScrollContainer from "./components/controls/ScrollContainer";

export default function App() {
  const [isNavOpen, setNavOpen] = useState({ left: false, right: false });
  const fnSaveWindowSizePosition = () => {
    let JsonObj = {};
    JsonObj.Width = window.innerWidth;
    JsonObj.Height = window.innerHeight;
    JsonObj.Left = window.screenX;
    JsonObj.Top = window.screenY;
    handleAPI({
      name: "SaveWindowSizePosition",
      params: {
        SessionID: handleParamFromURL(document.location.href, "SessionId"),
        ViewJSON: JSON.stringify(JsonObj),
        Updateflag: 1,
        FormID: 0,
        FormName: "VendorReact",
      },
      method: "POST",
    })
      .then((response) => {
        setNavOpen({ ...isNavOpen, right: !isNavOpen["right"] });
        console.log("fnSaveWindowSizePosition response ==>", response);
      })
      .catch((e) =>
        console.log("Error in fnSaveWindowSizePositio method => ", e)
      );
  };
  return (
    <ScrollContainer>
      <View style={{ width: "100%" }}>
        {Platform.OS === 'web' && handleParamFromURL(document.location.href, "DispHeader") == 1 && (
          <View style={{ zIndex: 11 }}>
            <CustomText style={styles.pageheader}>
              <View>
                <View style={styles.navBarRight}>
                  <TouchableOpacity
                    style={[
                      [styles.buttonContainer],
                      {
                        alignSelf: "center",
                        padding: 5,
                        borderRadius: "unset",
                      },
                    ]}
                    onPress={() => {
                      setNavOpen({
                        ...isNavOpen,
                        right: !isNavOpen["right"],
                      });
                    }}
                  >
                    <CustomText style={[styles["btn"]]}>{"Menu"}</CustomText>
                  </TouchableOpacity>
                  {isNavOpen["right"] && (
                    <View
                      style={{
                        backgroundColor: "#fff",
                        position: "absolute",
                        top: 39,
                        right: Platform.OS === "web" ? null : 3,

                        width: 250,
                        borderColor: "#d3dadf",
                        borderWidth: 2,
                        borderRadius: 5,
                        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
                      }}
                    >
                      <>
                        <CustomText
                          //key={index}
                          onPress={fnSaveWindowSizePosition}
                          style={styles.navRightOption}
                        >
                          Save Window Size and Position
                        </CustomText>

                        <TouchableOpacity
                          style={[
                            [styles.buttonContainer],
                            {
                              alignSelf: "baseline",
                              padding: 5,
                              margin: 5,
                              // borderRadius: "unset",
                            },
                            styles.navRightOption,
                          ]}
                          onPress={(e) =>
                            window.open(
                              `../../../BorrowerApplication/Presentation/Webforms/TitleFees.aspx?SessionId=${handleParamFromURL(
                                document.location.href,
                                "SessionId"
                              )}&LoanId=${handleParamFromURL(
                                document.location.href,
                                "LoanId"
                              )}&ref=0`,
                              "",
                              "height=800px,width=1200px,resizable=1,scrollbars=yes"
                            )
                          }
                        >
                          <CustomText style={[styles["btn"]]}>
                            {"Get Title Pricing"}
                          </CustomText>
                        </TouchableOpacity>
                      </>
                    </View>
                  )}
                </View>
              </View>
              Loan Vendor Contacts
            </CustomText>
          </View>
        )}
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
  buttonContainer: {
    backgroundColor: "#428bca",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    borderColor: "#b0cce5",
    borderWidth: 1,
  },
  btn: {
    color: "#fff",
    alignSelf: "flex-end",
    flexDirection: "row",
    textAlign: "center",
    fontSize: 13,
  },
  navBarRight: {
    flexDirection: "column",
    display: "none",
  },
  navBarRightText: {
    fontSize: 18,
    paddingTop: 7,
    paddingBottom: 3,
    paddingHorizontal: 10,
    color: "#212529",
  },
  navButtonContainer: {
    backgroundColor: "#b5d472",
    borderRadius: 15,
    paddingVertical: 3,
    paddingHorizontal: 3,
    width: 170,
    marginHorizontal: 5,
    color: "#212529",
    marginBottom: 10,
  },
  navButtonText: {
    color: "#fff",
    padding: 5,
    alignSelf: "center",
    fontSize: 16,
  },
  navRightOption: {
    paddingVertical: 8,
    marginHorizontal: 5,
    fontSize: 13,
    color: "#333333",
    borderBottomWidth: 1,
    borderBottomColor: "#dfd8d8",
    cursor: "pointer",
  },
});
