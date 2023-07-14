import { useCallback, useEffect } from "react";
import { Text, Platform } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

export default function CustomText(props) {
  let { children, style = {}, bold, onPress, italic, PlayFair } = props;

  SplashScreen.preventAutoHideAsync();

  let fontFamily = "OpenSansRegular",
    webStyle = {};

  if (bold) fontFamily = "OpenSansBold";

  if (italic) fontFamily = "OpenSansItalic";

  if (bold && italic) fontFamily = "OpenBoldItalic";

  if (PlayFair) fontFamily = "PlayFair";

  if (Platform.OS === "web") {
    fontFamily = `"Helvetica Neue",Helvetica,Arial,sans-serif`; //fontFamily.replace("OpenSans", "Helvetica");

    if (bold) webStyle["fontWeight"] = "bold";

    if (italic) webStyle["fontStyle"] = "italic";

    if (PlayFair) {
      fontFamily = "'Open Sans'";

      webStyle["fontSize"] = "14px";
    }
  }

  // console.log(fontFamily);

  const [fontsLoaded] = useFonts(
    Platform.OS === "web"
      ? {
          PlayFair: require("../../assets/fonts/Playfair_9pt_SemiCondensed-Regular.ttf"),
        }
      : {
          OpenSansRegular: require("../../assets/fonts/OpenSans-Regular.ttf"),
          OpenSansBold: require("../../assets/fonts/OpenSans-Bold.ttf"),
          OpenSansItalic: require("../../assets/fonts/OpenSans-Italic.ttf"),
          OpenBoldItalic: require("../../assets/fonts/OpenSans-BoldItalic.ttf"),
          PlayFair: require("../../assets/fonts/Playfair_9pt_SemiCondensed-Regular.ttf"),
        }
  );

  bold = bold ? bold : false;

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Text
      {...props}
      onLayout={onLayoutRootView}
      style={[style, webStyle, { fontFamily: fontFamily }]}
      onPress={onPress || null}
    >
      {children}
    </Text>
  );
}
