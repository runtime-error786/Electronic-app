import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch,useSelector } from 'react-redux';
import { Role } from '../Action';
const SignInForm = ({ navigation }) => {
  let dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSignIn = async () => {
    try {
      
      const response = await axios.get('http://192.168.1.104:2001/signin', {
        params: {
          email1: formData.email,
          pass1: formData.password,
        },
      });
      const { message, user, token } = response.data;
      console.warn(message,user,token);

      if (response.status === 200) {
        // Store the token in AsyncStorage
        await AsyncStorage.setItem('token', token);
        dispatch(Role(user.role));
        console.warn("d");
        if(user==="admin")
        {
          navigation.navigate('Add');
        }
        else{
          navigation.navigate('Signup');
        }
      }

      // Display a toast or alert with the response message
      console.log(message);
    } catch (error) {
        Toast.showWithGravity("Wrong credentials", Toast.LONG, Toast.TOP);
      // Handle error, display toast, or alert with an error message
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('email', text)}
        value={formData.email}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('password', text)}
        value={formData.password}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.signInButton}
        onPress={handleSignIn}
      >
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: hp(4),
    paddingBottom: hp(20),
    marginTop:hp(2)
  },
  label: {
    marginBottom: hp(1),
    color: 'black',
    fontSize: hp(2.5),
    fontWeight: 'bold',
  },
  input: {
    height: hp(6),
    borderColor: 'gray',
    borderWidth: hp(0.25),
    marginBottom: hp(4),
    padding: hp(1),
    borderRadius: hp(1.5),
  },
  productImage: {
    width: hp(20),
    height: hp(20),
    resizeMode: 'cover',
    marginBottom: hp(4),
    marginLeft: hp(12),
  },
  signInButton: {
    backgroundColor: '#596275',
    padding: hp(2),
    borderRadius: hp(2),
    alignItems: 'center',
  },
  signInButtonText: {
    color: 'white',
    fontSize: hp(3),
    fontWeight: 'bold',
  },
  signUpText: {
    color: 'blue',
    marginTop: hp(2),
    textAlign: 'center',
    fontSize: hp(2.5),
  },
});

export default SignInForm;
