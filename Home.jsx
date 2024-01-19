import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Image, FlatList, TouchableOpacity, TouchableHighlight,TextInput, Dimensions,ActivityIndicator } from 'react-native';
import { fetchProducts, current, deleteProducts, Search, fetchProducts1 } from '../Action';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards';
import FontAwesome2 from 'react-native-vector-icons/MaterialIcons';
import FontAwesome3 from 'react-native-vector-icons/Entypo';
import PaginationDot from 'react-native-insta-pagination-dots';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const Home = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productsReducer);
  const tota = useSelector((state) => state.Total);
  const curr = useSelector((state) => state.Current);
  const sea = useSelector((state) => state.NameSI);
  const userRole = useSelector((state) => state.Rolee);
  const [sea1, setCategory] = useState(route.params?.category);
  const [stackCurr, setStackCurr] = useState(curr); // Initialize with redux state
  const [stackSea, setStackSea] = useState(sea); // Initialize with redux state
  const [stackTot, setStackTot] = useState(tota); // Initialize with redux state
  const [stackProdduc, setStackProdduc] = useState(products); // Initialize with redux state
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  const fetchData = async () => {
    await dispatch(fetchProducts1(stackSea, stackCurr, sea1,setIsLoading));
    stackProdduc((prevCount) => products);

  };

  useEffect(() => {
    
    dispatch(fetchProducts1(stackSea, stackCurr, sea1,setIsLoading));
    setStackProdduc((prevCount) => products);
    console.warn("h1");
    

  }, [dispatch, stackCurr, stackSea, sea1]);

  useEffect(() => {
  

    dispatch(fetchProducts1(stackSea, stackCurr, sea1,setIsLoading))
    setStackProdduc((prevCount) => products);
    // dispatch(current(1));
    setStackCurr(1);
    console.log("h2");
   

  }, [stackSea, sea1]);

  useEffect(() => {
    console.log('Products changed:', stackProdduc);
 

    dispatch(fetchProducts1(stackSea, stackCurr, sea1,setIsLoading));
    setStackProdduc((prevCount) => products);

    console.log("h3");
  }, []);
  
  const loopj = () => {
    if (stackCurr >= 2) {
      // dispatch(current(curr - 1));
      setStackCurr((prevCount) => prevCount - 1);
    }
  };

  const loopb = () => {
    if (stackCurr < tota) {
      // dispatch(current(curr + 1));
      setStackCurr((prevCount) => prevCount + 1);

    } else {
      //dispatch(current(1)); // Reset current to 1 when it reaches total
      setStackCurr(1);

    }
  };

  const handleDelete = async (pname, price, qty) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token not found in AsyncStorage. User may not be authenticated.');
        // Handle the case where the token is not available
        return;
      }
  
      // Example product data
      const productData = {
        pname: pname,
        price: price,
        qty: qty,
      };
  
      const response = await axios.post('http://192.168.1.104:2001/addcart', productData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json',
        },
      });
  
      Toast.showWithGravity(response.data.message, Toast.LONG, Toast.TOP);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  

  useFocusEffect(
    React.useCallback(() => {

      //dispatch(current(1));
      setStackCurr(1);
      // dispatch(Search(''));
      setStackSea('');
      dispatch(fetchProducts1(sea, curr,sea1,setIsLoading));
      setStackProdduc((prevCount) => products);
      console.log("h4");

      return () => {
        // Cleanup or unsubscribe logic if needed
      };
    }, [])
  );

  let g1 = (e) => {
    // dispatch(Search(e));
    setStackSea(e);
  };

  const threeImages = [
    require('C:/Users/musta/OneDrive/Desktop/shopi/b.jpg'),
    require('C:/Users/musta/OneDrive/Desktop/shopi/c.jpg'),
    require('C:/Users/musta/OneDrive/Desktop/shopi/a.jpeg'),
  ];

  const renderCarouselItem = ({ item, index }) => (
    <View style={{ padding: 10, backgroundColor: 'lightgray', borderRadius: 8, margin: 5 }}>
      <Image
        source={item}
        style={{
          width: wp('80%'),
          height: hp(30),
          borderRadius: 8,
          backgroundColor:'black',
          resizeMode: 'contain', // Apply resizeMode: 'contain' here
        }}
      />
      
    </View>
  );

  const customCardStyle = {
    margin: hp(2),
    borderRadius: hp(2),
    borderWidth: hp(0.2),
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  };

  const customTitleStyle = {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const customPriceStyle = {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  };

  const customDescriptionStyle = {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  };

  const customButtonStyle = {
    backgroundColor: '#2f3640',
    alignSelf: 'center',
    borderRadius: hp(2),
    width: hp(30),
  };

  const customCardActionStyle = {
    justifyContent: 'center',
  };

  const renderProductCard = ({ item, index }) => {
    const isTablet = Dimensions.get('window').width >= 600;
    const numColumns = isTablet ? 3 : 1;

    const cardStyle = {
      ...customCardStyle,
      width: isTablet ? wp('26%') : wp('90%'), // Adjust the width as needed
      alignSelf: 'center',
    };
    const containerStyle = {
      flex: 1,
      justifyContent: 'center',
    };
    const paginationStyle = {
       flexDirection: 'row',
    justifyContent: 'center', // Center the pagination
    alignItems: 'center',
    marginVertical: hp(2), // Adjust the margin as needed
    };
    return (
      <View style={containerStyle}>
      <Card style={cardStyle}>
        <CardImage
  source={{ uri: `http://192.168.1.104:2001${item.img}` }}
  resizeMode="cover" // Add this line to set the resizeMode to "cover"
  style={{width:hp(43),height:hp(40)}}
/>

        <CardTitle title={item.pname} style={customTitleStyle} />
        <CardContent text={`Price: $${item.price}`} style={customPriceStyle} />
        <CardContent text={item.description} style={customDescriptionStyle} />
        <CardAction separator={false} inColumn={false} style={customCardActionStyle}>
        {
          userRole==="customer" && (
            <>
          <CardButton style={customButtonStyle} onPress={() => handleDelete(item.pname,item.price,1)} title="Add to cart" color="white" />
            </>
          )
        }
          {/* Add more CardButtons or customize as needed */}
        </CardAction>
      </Card>
     
      </View>
    );
  };
  
  
  const numColumns = wp('100%') >= 600 ? 3 : 1;

  return (
    <ScrollView>
    {isLoading ? (
        // Show ActivityIndicator while loading
        <ActivityIndicator size="larger" color="grey" style={{marginTop:'50%'}} />
      ) : (
<>
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
        value={stackSea}
        onChangeText={(e) => {
          g1(e);
        }}
      />
     <FlatList
        data={threeImages}
        renderItem={renderCarouselItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true} // Display horizontally
        pagingEnabled={true} // Enable paging
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
        onEndReachedThreshold={0.1} // Threshold for calling onEndReached
        loop={true}
      />
     
     <View style={{ flex: 1 }}>
     <Text style={{ fontWeight: 'bold',fontSize:hp(5),color:'black',alignSelf:"center" }}>{sea1} products</Text>
  <FlatList
    key={numColumns}
    data={products}
    renderItem={renderProductCard}
    keyExtractor={(item) => item.pname}
    numColumns={numColumns}
  />
  {products.length > 0 && (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: hp(10) }}>
      <TouchableHighlight onPress={loopj}>
        <Text>
          <FontAwesome2
            name="skip-previous"
            size={hp(3)}
            color={'#2f3640'}
          />
        </Text>
      </TouchableHighlight>

      <PaginationDot activeDotColor={'#2f3640'} curPage={stackCurr - 1} maxPage={tota} />

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

  
</View>

      </>)}
  </ScrollView>
  );
};

export default Home;
