import React, { useState } from 'react';
import { View, TouchableHighlight,Text, TextInput, Button, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    phone: '',
    city: '',
    country: '',
    pass: '',
    confirmpass: '',
    email: '',
    profilePic: null,
  });

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const openImagePicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 200,
        height: 200,
        cropping: true,
      });
  
      console.log('Selected Image:', image);
  
      if (image) {
        handleInputChange('profilePic', image.path || image.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };
  
  
  const isFormValid = () => {
    const { fname, lname, phone, city, country, pass, confirmpass, email } = formData;
  
    // Validate email using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.showWithGravity('Please enter a valid email address', Toast.LONG, Toast.TOP);
      return false;
    }
  
    if (!fname || !lname || !phone || !city || !country || !pass || !confirmpass || !email) {
      Toast.showWithGravity('All fields are required', Toast.LONG, Toast.TOP);
      return false;
    }
  
    if (pass !== confirmpass) {
      Toast.showWithGravity('Password and Confirm Password must match', Toast.LONG, Toast.TOP);
      return false;
    }
  
    return true;
  };
  

  const handleSubmit = async () => {
    if (isFormValid()) {
      // Prepare the data to be sent to the backend
      const formData1 = new FormData();
      formData1.append('firstName', formData.fname);
      formData1.append('lastName', formData.lname);
      formData1.append('phone', formData.phone);
      formData1.append('email', formData.email);
      formData1.append('city', formData.city);
      formData1.append('country', formData.country);
      formData1.append('pass', formData.pass);
      
      // Ensure that profilePic is not null before appending to formData
      if (formData.profilePic) {
        formData1.append('profilePic', {
          uri: formData.profilePic,
          type: 'image/jpeg', // or the actual content type of the image
          name: 'profilePic.jpg', // choose a name for the image
        });
      }
  
      // Send a POST request to the backend API
      try {
        const response = await axios.post('http://192.168.1.104:2001/signup', formData1, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Handle the successful response from the backend
        Toast.showWithGravity(response.data.message, Toast.LONG, Toast.TOP);
        setFormData({
          fname: '',
          lname: '',
          phone: '',
          email: '',
          city: '',
          country: '',
          pass: '',
          confirmpass: '',
          profilePic: null,
        });
      } catch (error) {
        // Handle the error from the backend
        console.error('Error submitting form:', error);
        Toast.showWithGravity('Failed to submit form', Toast.LONG, Toast.TOP);
      }
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>First Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('fname', text)}
        value={formData.fname}
      />

      <Text style={styles.label}>Last Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('lname', text)}
        value={formData.lname}
      />

      <Text style={styles.label}>Phone:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('phone', text)}
        value={formData.phone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>City:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('city', text)}
        value={formData.city}
      />

      <Text style={styles.label}>Country:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('country', text)}
        value={formData.country}
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('pass', text)}
        value={formData.pass}
        secureTextEntry
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('email', text)}
        value={formData.email}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Confirm Password:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('confirmpass', text)}
        value={formData.confirmpass}
        secureTextEntry
      />

      <TouchableHighlight style={{ backgroundColor: '#596275', padding: hp(2),marginBottom:hp(2), borderRadius: hp(2) }} onPress={openImagePicker}>
        <Text style={{ color: 'white', textAlign: 'center',fontSize:hp(3) }}>Profile Picture</Text>
      </TouchableHighlight>
      {formData.profilePic && (
        <Image source={{ uri: formData.profilePic }} style={styles.profilePic} />
      )}

      <TouchableHighlight
        style={{ backgroundColor: '#596275', padding: hp(2), borderRadius: hp(2) }}
        onPress={handleSubmit}
        underlayColor="darkgrey"
      >
        <Text style={{ color: 'white', textAlign: 'center',fontSize:hp(3) }}>Sign Up</Text>
      </TouchableHighlight>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: hp(4),
    paddingBottom:hp(30),
  },
  label: {
    marginBottom: hp(1),
    color: 'black',
    fontSize: hp(2.5), // Set your desired font size here
    fontWeight: 'bold', // Set your desired font weight here (e.g., 'bold', 'normal', etc.)
  },
  
  input: {
    height: hp(6),
    borderColor: 'gray',
    borderWidth: hp(0.25),
    marginBottom: hp(4),
    padding: hp(0),
    borderRadius:hp(1.5)
  },
  profilePic: {
    width: hp(20),
    height: hp(20),
    resizeMode: 'cover',
    marginBottom: hp(4),
    marginLeft:hp(12)
  },
});

export default SignUpForm;
