import React, { useEffect } from 'react';
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

const Delete = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productsReducer);
  const tota = useSelector((state) => state.Total);
  const curr = useSelector((state) => state.Current);
  const sea = useSelector((state) => state.NameSI);


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

  const handleDelete = (pname) => {
    // Call your function here with pname
    dispatch(deleteProducts(pname,sea,curr));
    if (products.length === 1 && curr > 1) {
      dispatch(current(curr - 1)); // Reduce current page if it's not the first page
    }
  
     
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
          <Text style={{ color: 'black', fontSize: hp(2.5), fontWeight: 'bold', alignSelf: 'center' }}>No products found</Text>
        ) : (
          <FlatList
            data={products}
            renderItem={({ item, index }) => (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(1), marginTop: hp(1) }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: `http://192.168.1.104:2001${item.img}` }} style={{ width: wp(23), height: hp(10), borderRadius: hp(6), marginRight: hp(10), marginLeft: hp(1) }} />
                    <Text style={{ alignSelf: 'center', width: wp(40), overflow: 'hidden', color: 'black', fontSize: hp(2.5), fontWeight: 'bold'}}>{item.pname}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableHighlight onPress={() => handleDelete(item.pname)}>
                      <Text style={{ color: 'red', marginRight: 10 }}>
                        <FontAwesome2
                          name="delete"
                          size={hp(5)}
                          color={'red'}
                        />
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>
                <View style={{ borderBottomWidth: hp(0.1), borderBottomColor: 'black', marginLeft: hp(1), marginRight: hp(1) }} />

                {/* Conditionally render pagination controls after the last product */}
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
      </View>
    </View>
  </>
  );
};

export default Delete;
