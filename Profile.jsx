import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get('window').height;
import { useFocusEffect } from '@react-navigation/native';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
  import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
  import FontAwesome2 from 'react-native-vector-icons/FontAwesome';
  import FontAwesome from 'react-native-vector-icons/Fontisto';
import { ScrollView } from 'react-native-gesture-handler';

const ProfileScreen = ({navigation}) => {
  const [profileData, setProfileData] = useState(null);
const chartConfig = {
    backgroundGradientFrom: "#2f3640",
    backgroundGradientFromOpacity: 2,
    backgroundGradientTo: "#2f3640",
    backgroundGradientToOpacity: 4.5,
    color: (opacity = 1) => `rgba(255, 255, 255, ${3})`,
    barPercentage: 1,
    useShadowColorFromDataset: false // optional
  };

   const fetchProfileData = async () => {
      try {
        // Retrieve the authentication token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        console.log('Token:', token);
        
        // Make a request to the /profile endpoint with the token
        const response = await axios.get('http://192.168.1.104:2001/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the profile data in state
        setProfileData(response.data);

      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Handle error, such as redirecting to the login screen
      }
    };

    useFocusEffect(
      React.useCallback(() => {
        console.log('Screen focused, fetching data...');
        fetchProfileData();
    
        return () => {
          // Cleanup or unsubscribe logic if needed
        };
      }, [])
    );

  if (!profileData) {
    // Render loading state or return null
    return null;
  }
  const barChartData = {
    labels: profileData.categoryQuantities.map((category) => category._id),
    datasets: [
      {
        data: profileData.categoryQuantities.map((category) => category.totalQuantity),
      },
    ],
    
  };
  return (
    <ScrollView>
    <View style={styles.container}>
    {profileData.profilePic && (
      <Image
  source={{ uri: `http://192.168.1.104:2001${profileData.profilePic}` }}
  style={[styles.profilePic, { alignSelf: 'center' }]}
/>

      )}

      <Text style={{  overflow: 'hidden', color: 'black', fontSize: hp(2.5), fontWeight: 'bold',alignSelf: 'center'  }}>
  Name: {profileData.fname || 'N/A'} {profileData.lname || 'N/A'}
</Text>
      <Text style={{  overflow: 'hidden', color: 'black', fontSize: hp(2.5), fontWeight: 'bold',alignSelf: 'center' }}>Phone: {profileData.phone || 'N/A'}</Text>
      <Text style={{  overflow: 'hidden', color: 'black', fontSize: hp(2.5), fontWeight: 'bold',alignSelf: 'center' }}>Email: {profileData.email || 'N/A'}</Text>
      <Text style={{  overflow: 'hidden', color: 'black', fontSize: hp(2.5), fontWeight: 'bold' ,alignSelf: 'center'}}>City: {profileData.city || 'N/A'}</Text>
      <Text style={{  overflow: 'hidden', color: 'black', fontSize: hp(2.5), fontWeight: 'bold' ,alignSelf: 'center'}}>Country: {profileData.country || 'N/A'}</Text>


      <View style={{ marginTop:hp(2),height: hp(10), backgroundColor: '#596275', justifyContent: 'center',borderRadius:hp(2),marginBottom: hp(1) }}>
  <Text style={{ overflow: 'hidden', color: 'black', fontSize: hp(5), fontWeight: 'bold', alignSelf: 'center',color:'white' }}> <FontAwesome
                  name="person"
                  size={hp(5)}
                  color={'white' }
                />  : {profileData.tc || 'N/A'}</Text>
</View>
<View style={{ height: hp(10), backgroundColor: '#596275', justifyContent: 'center',borderRadius:hp(2),marginBottom: hp(1) }}>
               
<Text style={{ overflow: 'hidden', color: 'black', fontSize: hp(5), fontWeight: 'bold', alignSelf: 'center',color:'white' }}><FontAwesome2
                  name="dollar"
                  size={hp(5)}
                  color={'white' }
                />  : {profileData.price || 'N/A'}</Text>
</View>


      

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <BarChart
    style={{ marginTop: hp(10), marginBottom: hp(15) }}
    data={barChartData}
    width={screenWidth * 0.9} // Adjust the multiplier as needed
    height={screenHeight * 0.4} // Adjust the multiplier as needed
    chartConfig={chartConfig}
    showValuesOnTopOfBars={true}
    showBarTops={true}
    fromZero={true}
    withInnerLines={true}
  />
</View>



    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: wp(3),
  },
  profilePic: {
    width: wp(50),
    height: hp(25),
    resizeMode: 'cover',
    marginBottom: 20,
  },
});

export default ProfileScreen;
