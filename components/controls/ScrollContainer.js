import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
} from "react-native";

const ScrollContainer = ({ children }) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <>
      {Platform.OS === "ios" ? (
        <>
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={30}
            keyboardShouldPersistTaps="handled"
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              automaticallyAdjustKeyboardInsets={true}
              bounces={false}
              contentContainerStyle={[styles.scrollContent]}
            >
              {children}
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      ) : (
        <>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView behavior={null} keyboardVerticalOffset={0}>
              <ScrollView
                contentContainerStyle={[styles.scrollContent]}
                keyboardShouldPersistTaps="handled"
              >
                {children}
              </ScrollView>
            </KeyboardAvoidingView>
          </KeyboardAwareScrollView>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "android" ? 50 : 0,
  },
});

export default ScrollContainer;
