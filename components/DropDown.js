// import React, { useState } from "react";
// import {
//   View,
//   Modal,
//   TextInput,
//   TouchableHighlight,
//   Text,
//   StyleSheet,
// } from "react-native";

// const DropdownInput = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedValue, setSelectedValue] = useState("");
//   const [inputValue, setInputValue] = useState("");

//   const handleOpenModal = () => {
//     setModalVisible(true);
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false);
//   };

//   const handleSelectValue = (value) => {
//     setSelectedValue(value);
//     setInputValue(value);
//     handleCloseModal();
//   };

//   const handleInputChange = (text) => {
//     setInputValue(text);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableHighlight
//         style={styles.button}
//         onPress={handleOpenModal}
//         underlayColor="#DDDDDD"
//       >
//         <Text style={styles.buttonText}>{selectedValue || "Select"}</Text>
//       </TouchableHighlight>

//       <Modal visible={modalVisible} animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalHeaderText}>Select Value</Text>
//           </View>

//           <TextInput
//             style={styles.input}
//             value={inputValue}
//             onChangeText={handleInputChange}
//           />

//           <TouchableHighlight
//             style={styles.modalButton}
//             onPress={() => handleSelectValue(inputValue)}
//             underlayColor="#DDDDDD"
//           >
//             <Text style={styles.modalButtonText}>Select</Text>
//           </TouchableHighlight>

//           <TouchableHighlight
//             style={styles.modalButton}
//             onPress={handleCloseModal}
//             underlayColor="#DDDDDD"
//           >
//             <Text style={styles.modalButtonText}>Cancel</Text>
//           </TouchableHighlight>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   button: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: "#DDDDDD",
//     borderRadius: 5,
//   },
//   buttonText: {
//     fontSize: 16,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//   },
//   modalHeader: {
//     marginBottom: 20,
//   },
//   modalHeaderText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   input: {
//     width: "80%",
//     height: 40,
//     borderColor: "#CCCCCC",
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   modalButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: "#DDDDDD",
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   modalButtonText: {
//     fontSize: 16,
//   },
// });

// export default DropdownInput;
////////////////////////////////////////

// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   FlatList,
//   Text,
//   TouchableOpacity,
// } from "react-native";

// const Dropdown = () => {
//   const [searchText, setSearchText] = useState("");
//   const [data, setData] = useState([
//     "Apple",
//     "Banana",
//     "Cherry",
//     "Durian",
//     "Elderberry",
//   ]);
//   const [filteredData, setFilteredData] = useState([]);

//   const handleSearch = (text) => {
//     setSearchText(text);
//     const filtered = data.filter((item) =>
//       item.toLowerCase().includes(text.toLowerCase())
//     );
//     setFilteredData(filtered);
//   };

//   const handleSelectItem = (item) => {
//     setSearchText(item);
//     setFilteredData([]);
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity onPress={() => handleSelectItem(item)}>
//       <Text style={{ padding: 10 }}>{item}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <TextInput
//         style={{
//           height: 40,
//           borderColor: "gray",
//           borderWidth: 1,
//           marginBottom: 10,
//         }}
//         onChangeText={handleSearch}
//         value={searchText}
//         placeholder="Search..."
//       />
//       <FlatList
//         data={filteredData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item}
//         keyboardShouldPersistTaps="always"
//       />
//     </View>
//   );
// };

// export default Dropdown;

///////////////////////////////////////////////////////////////

// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   Text,
// } from "react-native";

// const Dropdown = () => {
//   const [searchText, setSearchText] = useState("");
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [dropdownItems, setDropdownItems] = useState([
//     { id: 1, name: "Item 1" },
//     { id: 2, name: "Item 2" },
//     { id: 3, name: "Item 3" },
//     // Add more items as needed
//   ]);

//   const handleSearchTextChange = (text) => {
//     setSearchText(text);
//   };

//   const handleItemSelect = (item) => {
//     setSelectedItem(item);
//     setSearchText("");
//   };

//   const renderDropdownItem = ({ item }) => (
//     <TouchableOpacity
//       style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
//       onPress={() => handleItemSelect(item)}
//     >
//       <Text>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   const filteredDropdownItems = dropdownItems.filter((item) =>
//     item.name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       <TextInput
//         style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
//         placeholder="Search..."
//         value={searchText}
//         onChangeText={handleSearchTextChange}
//       />
//       <FlatList
//         data={filteredDropdownItems}
//         renderItem={renderDropdownItem}
//         keyExtractor={(item) => item.id.toString()}
//       />
//       {selectedItem && (
//         <View style={{ padding: 10 }}>
//           <Text>Selected Item: {selectedItem.name}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// // export default Dropdown;
// import React, { useState } from "react";
// import { View, TextInput } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// const DropdownTypeahead = () => {
//   const [selectedValue, setSelectedValue] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const [items, setItems] = useState([
//     { label: "Option 1", value: "option1" },
//     { label: "Option 2", value: "option2" },
//     { label: "Option 3", value: "option3" },
//   ]);

//   const handleInputChange = (text) => {
//     setInputValue(text);
//   };

//   const handleItemSelect = (item) => {
//     setSelectedValue(item.value);
//     setInputValue(item.label);
//   };

//   return (
//     <View>
//       <DropDownPicker
//         items={items}
//         defaultValue={selectedValue}
//         searchable={true}
//         searchablePlaceholder="Search..."
//         searchablePlaceholderTextColor="gray"
//         searchableError={() => <Text>Not Found</Text>}
//         searchableStyle={{ padding: 10 }}
//         style={{ backgroundColor: "#fafafa" }}
//         containerStyle={{ height: 40 }}
//         itemStyle={{ justifyContent: "flex-start" }}
//         dropDownStyle={{ backgroundColor: "#fafafa" }}
//         onChangeItem={handleItemSelect}
//       />
//       <TextInput
//         style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
//         value={inputValue}
//         onChangeText={handleInputChange}
//       />
//     </View>
//   );
// };

// export default DropdownTypeahead;
// import React, { useState } from "react";
// import { View, TextInput, FlatList, Text } from "react-native";
// import Autocomplete from "react-native-autocomplete-input";
// const DropdownTypeahead = () => {
//   const [selectedValue, setSelectedValue] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const [items, setItems] = useState([
//     { label: "Option 1", value: "option1" },
//     { label: "Option 2", value: "option2" },
//     { label: "Option 3", value: "option3" },
//   ]);

//   const handleInputChange = (text) => {
//     setInputValue(text);
//   };

//   const handleItemSelect = (item) => {
//     setSelectedValue(item.value);
//     setInputValue(item.label);
//   };

//   const renderItem = ({ item }) => (
//     <View style={{ padding: 10 }}>
//       <Text>{item.label}</Text>
//     </View>
//   );

//   const filteredItems = items.filter((item) =>
//     item.label.toLowerCase().includes(inputValue.toLowerCase())
//   );

//   return (
//     <View>
//       <Autocomplete
//         data={filteredItems}
//         defaultValue={inputValue}
//         onChangeText={handleInputChange}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.value}
//         onSelect={handleItemSelect}
//         renderTextInput={() => (
//           <TextInput
//             style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
//             value={inputValue}
//             onChangeText={handleInputChange}
//           />
//         )}
//       />
//     </View>
//   );
// };

// export default DropdownTypeahead;
// import React, { useEffect, useRef, useState } from "react";
// import { Keyboard, FlatList, View, TextInput } from "react-native";
// const DivList = () => {
//   const divRefs = useRef([]);
//   const [dropdownItems, setDropdownItems] = useState([
//     { id: 1, name: "Item 1" },
//     { id: 2, name: "Item 2" },
//     { id: 3, name: "Item 3" },
//     // Add more items as needed
//   ]);
//   useEffect(() => {
//     Keyboard.addListener("keyboardDidShow", handleKeyboardDidShow);
//     Keyboard.addListener("keyboardDidHide", handleKeyboardDidHide);

//     // Cleanup listeners
//     return () => {
//       Keyboard.removeAllListeners("keyboardDidShow", handleKeyboardDidShow);
//       Keyboard.removeAllListeners("keyboardDidHide", handleKeyboardDidHide);
//     };
//   }, []);

//   const handleKeyboardDidShow = () => {
//     // Enable keyboard handling
//     Keyboard.addListener("keydown", handleKeyDown);
//   };

//   const handleKeyboardDidHide = () => {
//     // Disable keyboard handling
//     Keyboard.removeAllListeners("keydown", handleKeyDown);
//   };

//   const handleKeyDown = ({ key }) => {
//     // Handle arrow key presses
//     console.log(key);

//     if (key === "ArrowUp") {
//       // Move up the list
//       // Logic to move focus or scroll to the previous div
//     } else if (key === "ArrowDown") {
//       // Move down the list
//       // Logic to move focus or scroll to the next div
//     }
//   };

//   const renderItem = ({ item, index }) => (
//     <View
//       ref={(ref) => (divRefs.current[index] = ref)}
//       style={{ marginBottom: 10 }}
//     >
//       {/* Render your div content here */}
//       <TextInput placeholder={`Div ${index + 1}`} />
//     </View>
//   );

//   return (
//     <FlatList
//       data={dropdownItems}
//       renderItem={renderItem}
//       keyExtractor={(_, index) => index.toString()}
//     />
//   );
// };
// export default DivList;

// import React, { useRef, useEffect, useState } from "react";
// import { View, ScrollView, Text } from "react-native";
// import KeyboardAwareScrollView from "react-native-keyboard-aware-scroll-view";

// const ListComponent = () => {
//   const scrollViewRef = useRef(null);
//   const [selectedItemIndex, setSelectedItemIndex] = useState(0);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (
//         e.key === "ArrowUp" &&
//         selectedItemIndex > 0 &&
//         scrollViewRef.current
//       ) {
//         setSelectedItemIndex(selectedItemIndex - 1);
//         scrollViewRef.current.scrollTo({
//           y: selectedItemIndex * 50,
//           animated: true,
//         });
//       } else if (
//         e.key === "ArrowDown" &&
//         selectedItemIndex < data.length - 1 &&
//         scrollViewRef.current
//       ) {
//         setSelectedItemIndex(selectedItemIndex + 1);
//         scrollViewRef.current.scrollTo({
//           y: (selectedItemIndex + 2) * 50,
//           animated: true,
//         });
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [selectedItemIndex]);

//   const data = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];

//   const renderListItems = () => {
//     return data.map((item, index) => (
//       <View
//         key={index}
//         style={{
//           height: 50,
//           justifyContent: "center",
//           paddingHorizontal: 10,
//           backgroundColor: index === selectedItemIndex ? "yellow" : "white",
//         }}
//       >
//         <Text>{item}</Text>
//       </View>
//     ));
//   };

//   return (
//     <View
//       ref={scrollViewRef}
//       keyboardShouldPersistTaps="always"
//       style={{ flex: 1 }}
//     >
//       {renderListItems()}
//     </View>
//   );
// };

// export default ListComponent;
