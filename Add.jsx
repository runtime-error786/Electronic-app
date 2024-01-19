import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableHighlight } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import { SelectList } from 'react-native-dropdown-select-list'

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    pname: '',
    desc: '',
    quant: '',
    price: '',
    category: '',
    img: null,
  });
  const data = [
    { key: '1', value: 'laptop'},
    { key: '2', value: 'mobile' },
    { key: '3', value: 'headphones' },
    { key: '4', value: 'other'}
  ];

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
        handleInputChange('img', image.path || image.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const isFormValid = () => {
    const { pname, desc, quant, price, category, img } = formData;

    if (!pname || !desc || !quant || !price || !category || !img) {
      Toast.showWithGravity('All fields are required', Toast.LONG, Toast.TOP);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (isFormValid()) {
      const formData1 = new FormData();
      formData1.append('pname', formData.pname);
      formData1.append('desc', formData.desc);
      formData1.append('quant', formData.quant);
      formData1.append('price', formData.price);
      formData1.append('category', formData.category);

      // Ensure that img is not null before appending to formData
      if (formData.img) {
        formData1.append('img', {
          uri: formData.img,
          type: 'image/jpeg', // or the actual content type of the image
          name: 'productImage.jpg', // choose a name for the image
        });
      }

      try {
        const response = await axios.post('http://192.168.1.104:2001/add', formData1, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        Toast.showWithGravity(response.data.message, Toast.LONG, Toast.TOP);

        // Reset the form states
        setFormData({
          pname: '',
          desc: '',
          quant: '',
          price: '',
          category: '',
          img: null,
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        Toast.showWithGravity('Failed to submit form', Toast.LONG, Toast.TOP);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Product Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('pname', text)}
        value={formData.pname}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('desc', text)}
        value={formData.desc}
        multiline
      />

      <Text style={styles.label}>Quantity:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('quant', text)}
        value={formData.quant}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange('price', text)}
        value={formData.price}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Category:</Text>
      <SelectList 
        setSelected={(val) => handleInputChange('category', val)} 
        data={data} 
        save="value"
        search={false}
    />

      <TouchableHighlight
        style={{ marginBottom:hp(2),marginTop:hp(2),padding: hp(2), borderRadius: hp(2),backgroundColor:"#596275" }}
        onPress={openImagePicker}
        underlayColor="darkgrey"
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: hp(3) }}>Choose Image</Text>
      </TouchableHighlight>
      {formData.img && (
        <Image source={{ uri: formData.img }} style={styles.productImage} />
      )}

      <TouchableHighlight
        style={{ backgroundColor: '#596275', padding: hp(2), borderRadius: hp(2) }}
        onPress={handleSubmit}
        underlayColor="darkgrey"
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: hp(3) }}>Add Product</Text>
      </TouchableHighlight>
    </ScrollView>
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
});

export default AddProductForm;
