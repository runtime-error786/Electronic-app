import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Image, FlatList, TextInput, TouchableHighlight } from 'react-native';
import { fetchProducts, current, deleteProducts, Search, fetchProducts2,fetchProducts3, fetchProducts4, totalPrice } from '../Action';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PaginationDot from 'react-native-insta-pagination-dots';
import { useFocusEffect } from '@react-navigation/native';
import { fetchProducts1 } from '../Action';
import FontAwesome2 from 'react-native-vector-icons/MaterialIcons';
import FontAwesome3 from 'react-native-vector-icons/Fontisto';
import { ScrollView } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// ... (your imports)

const Cart = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.cartReducer);
  const total = useSelector((state) => state.TotalCart);

  console.warn("hello");
  dispatch(totalPrice(products));

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchProducts2());
      dispatch(totalPrice(products));

    };

    fetchData();
  }, [dispatch]);

  const handleDelete = (pname) => {
    dispatch(fetchProducts4(pname));
    dispatch(totalPrice(products));

  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchProducts2());
      dispatch(totalPrice(products));
      return () => {
        // Cleanup or unsubscribe logic if needed
      };
    }, [])
  );

  let g1 = (e) => {
    dispatch(Search(e));
  };
  const handleIncrement = async (pname, quantity) => {
    const updatedQuantity = quantity + 1;
    await dispatch(fetchProducts3(updatedQuantity, pname));
    dispatch(totalPrice(products));

  };

  const handleDecrement = async (pname, quantity) => {
    
      const updatedQuantity = quantity - 1;
      await dispatch(fetchProducts3(updatedQuantity, pname));
      dispatch(totalPrice(products));

    
  };

  // Update your action to include a checkout function
const checkout = async () => {
  try {
    const token = await AsyncStorage.getItem('token'); // Replace 'yourTokenKey' with the actual key used to store the token
  
    if (!token) {
      console.error('Token not found in AsyncStorage');
      return;
    }
    const response = await axios.post('http://192.168.1.104:2001/checkout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    dispatch(fetchProducts2());
    dispatch(totalPrice(products));
    
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};



  return (
    <View style={{ flex: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#2f3640' }}>
      <Text style={{ alignSelf: 'center', width: hp(10), overflow: 'hidden', color: 'white', fontSize: hp(2.5), fontWeight: 'bold', marginLeft: hp(3) }}>Name:</Text>
      <Text style={{ alignSelf: 'center', width: hp(15), overflow: 'hidden', color: 'white', fontSize: hp(2.5), fontWeight: 'bold', marginLeft: hp(3) }}>Qty:</Text>
      <Text style={{ alignSelf: 'center', width: hp(15), overflow: 'hidden', color: 'white', fontSize: hp(2.5), fontWeight: 'bold', marginLeft: hp(-5) }}>Total:</Text>
    </View>
    <View style={{ marginBottom: hp(12), flex: 1 }}>
      {products.length === 0 ? (
        <Text style={{ color: 'black', fontSize: hp(2.5), fontWeight: 'bold', alignSelf: 'center' }}>No products found</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item, index }) => (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(1), marginTop: hp(1), marginLeft: hp(2) }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ alignSelf: 'center', width: hp(10), overflow: 'hidden', color: 'black', fontSize: hp(2), fontWeight: 'bold' }}>{item.pname}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* - Button */}
                    <TouchableHighlight onPress={() => handleDecrement(item.pname, item.quant)}>
                        <Text style={{ color: '#3498db', marginRight: 10 }}>
                          <Entypo
                            name="minus"
                            size={hp(3)}
                            color={'#3498db'}
                          />
                        </Text>
                      </TouchableHighlight>
                      {/* Quantity */}
                      <Text style={{ fontSize: hp(2), marginHorizontal: hp(1) }}>{item.quant}</Text>
                      {/* + Button */}
                      <TouchableHighlight onPress={() => handleIncrement(item.pname, item.quant)}>
                        <Text style={{ color: '#3498db', marginLeft: 10 }}>
                          <Entypo
                            name="plus"
                            size={hp(3)}
                            color={'#3498db'}
                          />
                        </Text>
                      </TouchableHighlight>

                  </View>
                  <Text style={{ alignSelf: 'center', width: hp(15), overflow: 'hidden', color: 'black', fontSize: hp(2), fontWeight: 'bold', marginLeft: hp(5) }}>{item.total}</Text>
                </View>
  
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* Delete Button */}
                  <TouchableHighlight onPress={() => handleDelete(item.pname)}>
                    <Text style={{ color: 'red', marginLeft: 10 }}>
                      <FontAwesome3
                        name="shopping-basket-remove"
                        size={hp(5)}
                        color={'red'}
                      />
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
              <View style={{ borderBottomWidth: hp(0.1), borderBottomColor: 'black', marginLeft: hp(1), marginRight: hp(1) }} />
            </>
          )}
          keyExtractor={(item) => item.pname}
        />
      )}
      <View style={{ alignItems: 'center', padding: hp(2) }}>
          <Text style={{ fontSize: hp(2.5), fontWeight: 'bold' }}>Total Price:{total} </Text>
          <TouchableHighlight onPress={() => {checkout();}}>
            <View style={{ backgroundColor: 'green', padding: hp(2), borderRadius: hp(1) }}>
              <Text style={{ color: 'white', fontSize: hp(2.5), fontWeight: 'bold' }}>Checkout</Text>
            </View>
          </TouchableHighlight>
        </View>
    </View>
    
  </View>
  
  );
};

export default Cart;


