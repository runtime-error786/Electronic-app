// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { View, Text, Image, FlatList, TouchableOpacity, TouchableHighlight,TextInput, Dimensions } from 'react-native';
// import { fetchProducts, current, deleteProducts, Search, fetchProducts1 } from '../Action';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { useFocusEffect } from '@react-navigation/native';
// import { ScrollView } from 'react-native-gesture-handler';
// import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards';
// import FontAwesome2 from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome3 from 'react-native-vector-icons/Entypo';
// import PaginationDot from 'react-native-insta-pagination-dots';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Toast from 'react-native-simple-toast';

// const Head = ({ navigation,route}) => {
//   const dispatch = useDispatch();
//   const products = useSelector((state) => state.productsReducer);
//   const tota = useSelector((state) => state.Total);
//   const curr = useSelector((state) => state.Current);
//   const sea = useSelector((state) => state.NameSI);
  
// //   const sea1 = useSelector((state) => state.NameSI1);

//    // Access the category from the route

//    const sea1 = route.params?.category ;
//    console.warn(sea1);

//   const fetchData = async () => {
//     await dispatch(fetchProducts1(sea, curr,sea1));
//   };

//   useEffect(() => {
//     fetchData();
//     console.log("h1");
//   }, [dispatch, curr, sea,sea1]);

//   useEffect(() => {
//     fetchData();
//     dispatch(current(1));
//     console.log("h2");

//   }, [sea,sea1]);

//   useEffect(() => {
//     console.log('Products changed:', products);
//     dispatch(fetchProducts1(sea, curr,sea1));
//     console.log("h3");

//   }, []);

//   const loopj = () => {
//     if (curr >= 2) {
//       dispatch(current(curr - 1));
//     }
//   };

//   const loopb = () => {
//     if (curr < tota) {
//       dispatch(current(curr + 1));
//     } else {
//       dispatch(current(1)); // Reset current to 1 when it reaches total
//     }
//   };

//   const handleDelete = async (pname, price, qty) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       console.warn("sa");
//       if (!token) {
//         console.error('Token not found in AsyncStorage. User may not be authenticated.');
//         // Handle the case where the token is not available
//         return;
//       }
  
//       // Example product data
//       const productData = {
//         pname: pname,
//         price: price,
//         qty: qty,
//       };
  
//       const response = await axios.post('http://192.168.1.104:2001/addcart', productData, {
//         headers: {
//           Authorization: `Bearer ${token}`, // Include the token in the Authorization header
//           'Content-Type': 'application/json',
//         },
//       });
  
//       Toast.showWithGravity(response.data.message, Toast.LONG, Toast.TOP);
//     } catch (error) {
//       console.error('Error adding item to cart:', error);
//     }
//   };
  

//   useFocusEffect(
//     React.useCallback(() => {
//       dispatch(current(1));
//       dispatch(Search(''));
//       dispatch(fetchProducts1(sea, curr,sea1));
//       console.log("h4");

//       return () => {
//         // Cleanup or unsubscribe logic if needed
//       };
//     }, [])
//   );

//   let g1 = (e) => {
//     dispatch(Search(e));
//   };

//   const threeImages = [
//     require('C:/Users/musta/OneDrive/Desktop/shopi/b.jpg'),
//     require('C:/Users/musta/OneDrive/Desktop/shopi/c.jpg'),
//     require('C:/Users/musta/OneDrive/Desktop/shopi/a.jpeg'),
//   ];

//   const renderCarouselItem = ({ item, index }) => (
//     <View style={{ padding: 10, backgroundColor: 'lightgray', borderRadius: 8, margin: 5 }}>
//       <Image
//         source={item}
//         style={{
//           width: wp('90%'),
//           height: hp(30),
//           borderRadius: 8,
//           backgroundColor:'black',
//           resizeMode: 'contain', // Apply resizeMode: 'contain' here
//         }}
//       />
//     </View>
//   );

//   const customCardStyle = {
//     margin: hp(2),
//     borderRadius: hp(2),
//     borderWidth: hp(0.2),
//     borderColor: '#ddd',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: hp(1) },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//   };

//   const customTitleStyle = {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   };

//   const customPriceStyle = {
//     fontSize: 16,
//     color: 'green',
//     textAlign: 'center',
//   };

//   const customDescriptionStyle = {
//     fontSize: 14,
//     color: 'gray',
//     textAlign: 'center',
//   };

//   const customButtonStyle = {
//     backgroundColor: '#2f3640',
//     alignSelf: 'center',
//     borderRadius: hp(2),
//     width: hp(30),
//   };

//   const customCardActionStyle = {
//     justifyContent: 'center',
//   };

//   const renderProductCard = ({ item, index }) => {
//     const isTablet = Dimensions.get('window').width >= 600;
//     const numColumns = isTablet ? 2 : 1;

//     const cardStyle = {
//       ...customCardStyle,
//       width: isTablet ? wp('45%') : wp('90%'), // Adjust the width as needed
//       alignSelf: 'center',
//     };
  
//     return (
//       <View>
//       <Card style={cardStyle}>
//         <CardImage source={{ uri: `http://192.168.1.104:2001${item.img}` }} />
//         <CardTitle title={item.pname} style={customTitleStyle} />
//         <CardContent text={`Price: $${item.price}`} style={customPriceStyle} />
//         <CardContent text={item.description} style={customDescriptionStyle} />
//         <CardAction separator={false} inColumn={false} style={customCardActionStyle}>
//           <CardButton style={customButtonStyle} onPress={() => handleDelete(item.pname,item.price,1)} title="Add to cart" color="white" />
//           {/* Add more CardButtons or customize as needed */}
//         </CardAction>
//       </Card>
//       {index === products.length - 1 && (
//                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: hp(0) }}>
//                     <TouchableHighlight onPress={loopj}>
//                       <Text>
//                         <FontAwesome2
//                           name="skip-previous"
//                           size={hp(3)}
//                           color={'#2f3640'}
//                         />
//                       </Text>
//                     </TouchableHighlight>

//                     <PaginationDot activeDotColor={'#2f3640'} curPage={curr - 1} maxPage={tota} />

//                     <TouchableHighlight onPress={loopb}>
//                       <Text>
//                         <FontAwesome3
//                           name="controller-next"
//                           size={hp(3)}
//                           color={'#2f3640'}
//                         />
//                       </Text>
//                     </TouchableHighlight>
//                   </View>
//                 )}
//       </View>
//     );
//   };
  
  
//   const numColumns = wp('100%') >= 600 ? 2 : 1;

//   return (
//     <ScrollView>
//     <TextInput
//         placeholder="Search here"
//         placeholderTextColor="white"
//         style={{
//           marginTop: hp(1),
//           borderColor: '#2f3640',
//           borderRadius: hp(1),
//           backgroundColor: '#2f3640',
//           color: 'white',
//           fontSize: hp(2),
//           fontWeight: 'bold',
//         }}
//         value={sea}
//         onChangeText={(e) => {
//           g1(e);
//         }}
//       />
//      <FlatList
//         data={threeImages}
//         renderItem={renderCarouselItem}
//         keyExtractor={(item, index) => index.toString()}
//         horizontal={true} // Display horizontally
//         pagingEnabled={true} // Enable paging
//         showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
//         onEndReachedThreshold={0.1} // Threshold for calling onEndReached
//         loop={true}
//       />
     
//     <View style={{ alignContent: 'center',marginBottom:hp(15) }}>
//         <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: hp(4), color: '#2f3640' }}>All Products</Text>
//          <FlatList
//           key={numColumns}
//           data={products}
//           renderItem={renderProductCard}
//           keyExtractor={(item) => item.pname}
//           numColumns={numColumns}
//         />

//       </View>
//   </ScrollView>
//   );
// };

// export default Head;
