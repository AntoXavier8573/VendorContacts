import React, { useRef, useState } from "react";

import { StyleSheet, TouchableOpacity, Modal, View } from "react-native";

import CustomText from "./CustomText";

import Icon from "react-native-vector-icons/Entypo";

import { web, android } from "./Platform";

import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

const Dropdown = (props) => {
  let {
    label,

    options,

    onSelect,

    placeholder = "",

    value = null,

    isMap,

    isValid = false,

    disabled = false,
  } = props;

  try {
    if (value && !web) {
      // console.log(label, options, value);

      value = options.filter(
        (state) =>
          state[isMap ? "Id" : "Company"].toString().toLowerCase() ===
          value?.toString().toLowerCase()
      )[0][!isMap ? "Id" : "Company"];
    }
  } catch (error) {
    // console.log("Error form DropDown ====> ", error);
  }

  // console.log(label, value, options);

  const DropdownButton = useRef();

  const [visible, setVisible] = useState(false);

  const [dropdown, setDropdown] = useState({ top: 0, left: 0, opacity: 0 });

  const toggleDropdown = () => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = () => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdown({
        top: py + h - (android ? 55 : 30),

        left: _px + 15,

        width: _w - 30,

        opacity: 1,
      });
    });

    setVisible(true);
  };

  const onItemPress = (item) => {
    setVisible(false);

    onSelect(item);
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.item}
        onPress={() => onItemPress(item)}
      >
        <CustomText
          style={[
            {
              paddingHorizontal: 15,

              paddingVertical: 5,
            },

            item[isMap ? "Id" : "Company"] == value
              ? { backgroundColor: "#318CE7", color: "#fff" }
              : {},
          ]}
        >
          {item.label}
        </CustomText>
      </TouchableOpacity>
    );
  };

  const renderDropdown = () => {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View
          style={[
            styles.inputBoxContainer,
            {
              borderColor: "gray",
              width: "100%",
              borderColor: isValid ? "red" : "silver",
            },
          ]}
        >
          <CustomText bold={true} style={styles.inputBoxLabel}>
            {label || ""}
          </CustomText>
          {web ? (
            <select
              disabled={disabled}
              style={styles.inputBox}
              value={value || ""}
              onChange={(e) => {
                let { value, label = e.target.selectedOptions[0].text } =
                  e.target;

                onSelect({ value, label });
              }}
            >
              {options.map((item, index) => (
                <option key={index} value={item["Id"]}>
                  {item["Company"]}
                </option>
              ))}
            </select>
          ) : (
            <View
              style={[
                styles.inputBox,
                {
                  width: "100%",
                  marginRight: 10,
                  borderWidth: 0,
                },
              ]}
            >
              <Modal visible={visible} transparent animationType="fade">
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.overlay}
                  onPress={() => setVisible(false)}
                >
                  <View
                    style={[
                      styles.dropdown,
                      {
                        top: dropdown["top"],
                        left: dropdown["left"],
                        width: dropdown["width"],
                        opacity: dropdown["opacity"],
                      },
                      web ? { overflow: "auto", maxHeight: 300 } : {},
                    ]}
                  >
                    <KeyboardAwareFlatList
                      style={{ maxHeight: 250 }}
                      data={options}
                      renderItem={renderItem}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      tabIndex={-1}
      activeOpacity={1}
      ref={DropdownButton}
      style={styles.button}
      onPress={() => {
        if (!disabled) toggleDropdown();
      }}
    >
      {renderDropdown()}

      {!web && (
        <>
          <CustomText style={styles.buttonText}>
            {value || placeholder}
          </CustomText>
          <Icon
            style={styles.icon}
            size={17}
            name={`chevron-${visible ? "up" : "down"}`}
          />
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  buttonText: {
    flex: 1,
    color: "rgb(81, 87, 93)",
    textAlign: "center",
    textAlign: "left",
    position: "absolute",
    top: 20,
    left: 15,
  },

  icon: {
    right: 20,
    top: 22,
    position: "absolute",
  },
  dropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    width: 350,

    // shadowColor: "#000000",

    // shadowRadius: 4,

    // shadowOffset: { height: 4, width: 0 },

    // shadowOpacity: 0.5,

    borderWidth: 1,

    borderColor: "#999",
  },

  overlay: {
    width: "100%",

    height: "100%",

    borderWidth: 2,
  },

  item: {
    borderBottomWidth: 1,

    borderBottomColor: "rgba(0,0,0,.04)",
  },

  inputBoxContainer: {
    flexDirection: "row",

    borderColor: "gray",

    borderWidth: 1,

    borderRadius: 8,

    padding: 10,
    outline: "none",
    // marginBottom: 20,
  },

  inputBoxLabel: {
    position: "absolute",

    backgroundColor: "#fff",

    top: -12,

    left: 3,

    fontSize: 14,

    color: "gray",

    paddingHorizontal: 3,
  },

  inputBox: {
    ...{
      borderWidth: 0,

      borderRadius: 5,

      fontSize: web ? 12 : 16,

      backgroundColor: "rgba(0,0,0,.04)",

      color: "#51575d",

      width: "100%",

      //  padding: 5,

      // height: 35,
    },
  },
});

export default Dropdown;
