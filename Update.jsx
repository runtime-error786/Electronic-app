import React, { useEffect,useState  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Image, FlatList, TextInput, TouchableHighlight } from 'react-native';
import { fetchProducts, current, deleteProducts, Search } from '../Action';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PaginationDot from 'react-native-insta-pagination-dots';
import { useFocusEffect } from '@react-navigation/native';
import { fetchProducts1 } from '../Action';
import FontAwesome2 from 'react-native-vector-icons/MaterialIcons';
import FontAwesome3 from 'react-native-vector-icons/Entypo';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwesome4 from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import FontAwesome5 from 'react-native-vector-icons/AntDesign';
import { updateProduct } from '../Action';

const Update = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productsReducer);
  const tota = useSelector((state) => state.Total);
  const curr = useSelector((state) => state.Current);
  const sea = useSelector((state) => state.NameSI);
  const [isModalVisible, setModalVisible] = useState(false); // State for managing modal visibility
  const [modalPName, setModalPName] = useState('');
  const [modalPrice, setModalPrice] = useState(0);
  const [modalQty, setModalQty] = useState(0);
  

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchProducts(sea, curr));
    };

    fetchData();

    // Add any cleanup logic if needed
  }, [dispatch, curr]);

  const fetchData = async () => {
    await dispatch(fetchProducts(sea, curr));
  };
  
  useEffect(() => {
    

    fetchData();
    dispatch(current(1));
    // Add any cleanup logic if needed
  }, [sea]);

  useEffect(() => {
    console.log('Products changed:', products);
    dispatch(fetchProducts(sea, curr));
  }, []);  // Empty dependency array to run the effect only once when the component mounts

  const loopj = () => {
    if (curr >= 2) {
      dispatch(current(curr - 1));
    }
  };

  const loopb = () => {
    if (curr < tota) {
      dispatch(current(curr + 1));
    } else {
      dispatch(current(1)); // Reset current to 1 when it reaches total
    }
  };
  const increaseQty = () => {
    setModalQty(modalQty + 1);
  };
  
  const decreaseQty = () => {
    if (modalQty > 0) {
      setModalQty(modalQty - 1);
    }
  };
  const increasePrice = () => {
    setModalPrice(modalPrice + 1);
  };
  
  const decreasePrice = () => {
    if (modalPrice > 0) {
      setModalPrice(modalPrice - 1);
    }
  };
  
  const handleDelete = (pname, price, qty) => {
    setModalPName(pname);
    setModalPrice(price);
    setModalQty(qty);
    setModalVisible(true);
  };
  const updateOne = async(pname, updatedPrice, updatedQty) => {
    // Call your updateone function with the updated values
    setModalVisible(false);
    dispatch(updateProduct(pname, updatedPrice, updatedQty,sea,curr));
  };
  useFocusEffect(
    React.useCallback(() => {
      dispatch(current(1));
      dispatch(Search(''));
      dispatch(fetchProducts(sea, curr)); // Assuming you want to reset to the first page when focused
      return () => {
        // Cleanup or unsubscribe logic if needed
      };
    }, [])
  );

  let g1 = (e)=>{
    dispatch(Search(e));
  }
  return (
    <>
    <View style={{ flex: 1 }}>
  <TextInput
    placeholder="Search here"
    placeholderTextColor="white"
    style={{
      marginTop: hp(1),
      borderColor: '#2f3640',
      borderRadius: hp(1),
      backgroundColor: '#2f3640',
      color: 'white',
      fontSize: hp(2),
      fontWeight: 'bold',
    }}
    value={sea}
    onChangeText={(e) => {
      g1(e);
    }}
  />

  
    <View style={{ marginBottom: hp(12), flex: 1 }}>
      {products.length === 0 ? (
        <Text style={{ color: 'black', fontSize: hp(2.5), fontWeight: 'bold',alignSelf:'center' }}>No products found</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item, index }) => (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(1), marginTop: hp(4) }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ alignSelf: 'center', width: hp(10), overflow: 'hidden', color: 'black', fontSize: hp(2.5), fontWeight: 'bold',marginLeft:hp(3) }}>{item.pname}</Text>
                  <Text style={{ alignSelf: 'center', width: hp(10), overflow: 'hidden', color: 'black', fontSize: hp(2.5), fontWeight: 'bold',marginLeft:hp(4) }}>Price:{item.price}$</Text>
                  <Text style={{ alignSelf: 'center', width: hp(10), overflow: 'hidden', color: 'black', fontSize: hp(2.5), fontWeight: 'bold',marginLeft:hp(6) }}>Qty:{item.quant}</Text>

                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableHighlight onPress={() => handleDelete(item.pname,item.price,item.quant)}>
                    <Text style={{ color: 'red', marginRight: hp(1) }}>
                      <FontAwesome4
                        name="update"
                        size={hp(4)}
                        color={'green'}
                      />
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
              <View style={{ borderBottomWidth: hp(0.1), borderBottomColor: 'black', marginLeft: hp(1), marginRight: hp(1) }} />
              {index === products.length - 1 && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: hp(0) }}>
                    <TouchableHighlight onPress={loopj}>
                      <Text>
                        <FontAwesome2
                          name="skip-previous"
                          size={hp(3)}
                          color={'#2f3640'}
                        />
                      </Text>
                    </TouchableHighlight>

                    <PaginationDot activeDotColor={'#2f3640'} curPage={curr - 1} maxPage={tota} />

                    <TouchableHighlight onPress={loopb}>
                      <Text>
                        <FontAwesome3
                          name="controller-next"
                          size={hp(3)}
                          color={'#2f3640'}
                        />
                      </Text>
                    </TouchableHighlight>
                  </View>
                )}
            </>
          )}
          keyExtractor={(item) => item.pname}
        />
      )}
      <Modal isVisible={isModalVisible}>
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: hp(4), color: 'white', fontWeight: 'bold', marginBottom: hp(2) }}>
      Updation
    </Text>
    <Text style={{ fontSize: hp(2.5), color: 'white', fontWeight: 'bold', marginBottom: hp(1) }}>
      Product: {modalPName}
    </Text>

    {/* Price Adjustment */}
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontSize: hp(2.5), color: 'white', fontWeight: 'bold', marginRight: hp(1) }}>
        Price: 
      </Text>
      <TouchableHighlight onPress={decreasePrice}>
        <FontAwesome3 name="minus" size={hp(3)} color={'red'} />
      </TouchableHighlight>
      <Text style={{ fontSize: hp(2.5), color: 'white', fontWeight: 'bold', marginRight: hp(1) }}>
        {modalPrice}$
      </Text>
      <TouchableHighlight onPress={increasePrice}>
        <FontAwesome3 name="plus" size={hp(3)} color={'green'} />
      </TouchableHighlight>
    </View>

    {/* Quantity Adjustment */}
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(2) }}>
      <Text style={{ fontSize: hp(2.5), color: 'white', fontWeight: 'bold', marginRight: hp(1) }}>
        Quantity:
      </Text>
      <TouchableHighlight onPress={decreaseQty}>
        <FontAwesome3 name="minus" size={hp(3)} color={'red'} />
      </TouchableHighlight>
      <Text style={{ fontSize: hp(2.5), color: 'white', fontWeight: 'bold', marginRight: hp(1) }}>
        {modalQty}
      </Text>
      <TouchableHighlight onPress={increaseQty}>
        <FontAwesome3 name="plus" size={hp(3)} color={'green'} />
      </TouchableHighlight>
    </View>

    {/* Close and Confirm Buttons */}
    <View style={{ flexDirection: 'row', marginTop: hp(2) }}>
      <TouchableHighlight onPress={() => setModalVisible(false)} style={{ marginLeft: hp(2) }}>
        <FontAwesome5 name="closecircle" size={hp(5)} color={'red'} />
      </TouchableHighlight>
      <TouchableHighlight onPress={() => {
                // Pass updated values to the updateOne function
                updateOne(modalPName, modalPrice, modalQty);
                
              }}  style={{ marginLeft: hp(5) }}>
        <FontAwesome2 name="cloud-done" size={hp(5)} color={'green'} />
      </TouchableHighlight>
    </View>
  </View>
</Modal>



      
    </View>
</View>


    </>
  );
};

export default Update;
