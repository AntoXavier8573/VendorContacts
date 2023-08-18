import { useCallback, useState } from "react";
import {
  Keyboard,
  TextInput,
  StyleSheet,
  Platform,
  View,
  Text,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import CustomText from "./CustomText";

const InputBox = (props) => {
  const {
    label,
    onChangeText,
    value,
    type,
    placeholder,
    ref,
    secureTextEntry,
    validate,
    border,
    backgroundColor,
    onBlur,
    onFocus,
  } = props;
  const [hoverStyle] = useState(
    Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      default: {
        borderColor: "#66afe9",
        outline: 0,
        "-webkit-box-shadow":
          "inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)",
        boxShadow:
          "inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)",
      },
    })
  );
  const [InputField, setInputField] = useState(false);
  const [fontsLoaded] = useFonts({
    OpenSansRegular: require("../../assets/fonts/OpenSans-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={[
        styles.inputBoxContainer,
        {
          borderColor: border
            ? border
            : validate && value === ""
            ? "red"
            : "gray",
        },
      ]}
    >
      <CustomText
        bold={true}
        style={[
          styles.inputBoxLabel,
          { backgroundColor: backgroundColor || "#fff" },
        ]}
      >
        {label || ""}
      </CustomText>
      <TextInput
        onLayout={onLayoutRootView}
        style={[
          styles.inputBox,
          InputField && Platform.OS === "web"  && hoverStyle,
          { fontFamily: "OpenSansRegular" },
          Platform.OS === "web" && { outline: "none" },
        ]}
        //   placeholderTextColor="#999"
        onChangeText={(text) => onChangeText(text)}
        secureTextEntry={secureTextEntry || false}
        value={value || ""}
        placeholder={placeholder || ""}
        keyboardType={type || "default"}
        autoCapitalize={"none"}
        ref={ref || null}
        onBlur={(e) => {
          // onBlur();
          setInputField(false);
        }}
        onFocus={() =>
          //onFocus()
          setInputField(true)
        }
        {...props}
        // hoverStyle={{ borderWidth: 0, outlineWidth: 0 }}
        // activeStyle={{ borderWidth: 0, outlineWidth: 0 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    marginVertical: 12,
  },

  title: {
    fontSize: 21,
    // marginTop: 15,
    marginBottom: 15,
    color: "#41464d",
  },
  buttonContainer: {
    backgroundColor: "#2c86d1",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  buttonText: {
    fontSize: 20,
    color: "#fff",
    alignSelf: "center",
  },

  optionContainer: {
    backgroundColor: "#f2f5f8",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderColor: "#606060",
    borderWidth: 1,
    marginBottom: 20,
    flexDirection: "row",
  },

  optionText: {
    fontSize: 18,
    color: "#787878",
    width: "100%",
    textAlign: "center",
    flex: 1,
    flexShrink: 1,
  },

  inputBox: {
    borderWidth: 0,
    // outlineWidth: 0,
    borderRadius: 5,
    fontSize: Platform.OS === "web" ? 13 : 15,
    backgroundColor: "rgba(0,0,0,.04)",
    color: "#51575d",
    width: "100%",
    padding: 5,
    height: Platform.OS === "web" ? 34 : 28,
  },

  inputBoxLabel: {
    // display: "inline",
    position: "absolute",
    backgroundColor: "#fff",
    top: -12,
    left: 3,
    fontSize: Platform.OS === 'web' ?13 : 12,
    color: "gray",
    paddingHorizontal: 3,
  },

  inputBoxContainer: {
    flexDirection: "row",
    borderColor: "silver",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },

  iconButtonContainer: {
    backgroundColor: "#1a63ad",
    borderRadius: 25,
    height: 45,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 8,
    paddingTop: Platform.OS === "web" ? "5px" : null,
    alignSelf: "flex-start",
    padding: 30,
  },

  iconButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default InputBox;
