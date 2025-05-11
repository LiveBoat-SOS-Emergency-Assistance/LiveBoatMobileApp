// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   FlatList,
//   Modal,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import useDebounce from "../../hooks/useDebounce";
// import * as searchService from "~/services/searchService";

// function Search() {
//   const [searchValue, setSearchValue] = useState("");
//   const [searchResult, setSearchResult] = useState([]);
//   const [showResult, setShowResult] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const inputRef = useRef<TextInput>(null);
//   const debouncedValue = useDebounce(searchValue, 500);

//   useEffect(() => {
//     if (!debouncedValue.trim()) {
//       setSearchResult([]);
//       return;
//     }
//     const fetchApi = async () => {
//       setLoading(true);
//       const result = await searchService.search(debouncedValue);
//       setSearchResult(result);
//       setLoading(false);
//     };
//     fetchApi();
//   }, [debouncedValue]);

//   const handleClear = () => {
//     setSearchValue("");
//     setShowResult(false);
//   };

//   const handleChange = (text: string) => {
//     if (!text.startsWith(" ")) {
//       setSearchValue(text);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchBox}>
//         <TextInput
//           ref={inputRef}
//           style={styles.input}
//           placeholder="Search"
//           value={searchValue}
//           onChangeText={handleChange}
//           onFocus={() => setShowResult(true)}
//         />
//         {searchValue && !loading && (
//           <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
//             <Text style={styles.clearText}>×</Text>
//           </TouchableOpacity>
//         )}
//         {loading && (
//           <ActivityIndicator
//             size="small"
//             color="#93949a"
//             style={styles.loadingIndicator}
//           />
//         )}
//         <TouchableOpacity onPress={() => {}} style={styles.searchButton}>
//           <Text style={styles.searchIcon}>🔍</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Modal Popup */}
//       <Modal
//         visible={showResult && searchResult.length > 0}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowResult(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPressOut={() => setShowResult(false)}
//         >
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Accounts</Text>
//             <FlatList
//               data={searchResult}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item }) => <AccountItem data={item} />}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//   },
//   searchBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f1f1f2",
//     borderRadius: 50,
//     paddingHorizontal: 16,
//     height: 50,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//   },
//   clearButton: {
//     paddingHorizontal: 10,
//   },
//   clearText: {
//     fontSize: 24,
//     color: "#16182333",
//   },
//   loadingIndicator: {
//     marginHorizontal: 8,
//   },
//   searchButton: {
//     padding: 8,
//   },
//   searchIcon: {
//     fontSize: 20,
//     color: "#93949a",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.2)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     width: "80%",
//     maxHeight: "60%",
//     borderRadius: 8,
//     padding: 10,
//   },
//   modalTitle: {
//     fontWeight: "bold",
//     fontSize: 16,
//     marginBottom: 10,
//     color: "#93949a",
//   },
// });

// export default Search;
