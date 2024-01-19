import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import FontAwesome from 'react-native-vector-icons/AntDesign';
import FontAwesome1 from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome2 from 'react-native-vector-icons/Entypo';
import SignUpForm from './pag/Signup';
import AddProductForm from './pag/Add';
import SignInForm from './pag/Signin';
import ProfileScreen from './pag/Profile';
import { Storee } from './Store';
import { Provider } from 'react-redux';
import Delete from './pag/Delete';
import Update from './pag/Update';
import FontAwesome11 from 'react-native-vector-icons/FontAwesome';
import FontAwesome12 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome13 from 'react-native-vector-icons/MaterialIcons';
import Cart from './pag/Cart';
import Home from './pag/Home';
import { useDispatch, useSelector } from 'react-redux';
import { Role, Search11 } from './Action';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import Head from './pag/Head';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState } from 'react';
// Rolee



function SignOutButton({ navigation }) {

  
    navigation.navigate('Up'); // Replace 'SignInScreen' with the actual screen name
 
}




function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
    </View>
  );
}


const CartStack = createStackNavigator();

function CartStackScreen() {
  return (
    <CartStack.Navigator
      initialRouteName="cart"
      screenOptions={({ navigation }) => ({
        //headerRight: () => <SignOutButton navigation={navigation} />,
        headerStyle: { backgroundColor: '#2f3640' },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
      })}
    >
      <CartStack.Screen name="cart"  component={Cart} options={{
          title: 'Cart Items',
        }}/>
       
    </CartStack.Navigator>
      
  );
}

const HomeStack = createStackNavigator();

function HomeStackScreen({ navigation }) {
  const userRole = useSelector((state) => state.Rolee);
  const dispatch = useDispatch();

  const handleSignOutPress = async () => {
    try {
      await R1(); // Call the sign-out function
      dispatch(Role("guest"));
      navigation.navigate('All');
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Error during sign-out:', error);
      // Handle errors, such as network issues, etc.
    }
  };

  return (
    <HomeStack.Navigator
      initialRouteName="ho1"
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#2f3640' },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
        headerRight: () => (
          <HeaderRightContent navigation={navigation} userRole={userRole} onSignOut={handleSignOutPress} />
        ),
      })}
    >
      <HomeStack.Screen
        name="ho1"
        component={Home}
        initialParams={{ category: 'all' }}
        options={{
          title: 'Home',
        }}
      />
      <HomeStack.Screen
        name="Signin"
        component={SignInForm}
        options={{
          title: 'Sign In',
          headerBackTitleVisible: false, // Ensure back button doesn't show the title
        }}
      />
      <HomeStack.Screen
        name="Signup"
        component={SignUpForm}
        options={{
          title: 'Sign Up',
          headerBackTitleVisible: false, // Ensure back button doesn't show the title
        }}
      />
    </HomeStack.Navigator>
  );
}

const HeaderRightContent = ({ navigation, userRole, onSignOut }) => {
  if (userRole === 'guest') {
    return (
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() =>navigation.navigate('Signin') } // Replace with actual navigation logic
      >
        <Text style={{ color: 'white' }}>Sign In</Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={onSignOut}
      >
        <Text style={{ color: 'white' }}>Sign Out</Text>
      </TouchableOpacity>
    );
  }
}




const HeadStack = createStackNavigator();

function HeadStackScreen({navigation}) {
  

  const userRole = useSelector((state) => state.Rolee);
  const dispatch = useDispatch();

  const handleSignOutPress = async () => {
    try {
      await R1(); // Call the sign-out function
      dispatch(Role("guest"));
      navigation.navigate('All');
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Error during sign-out:', error);
      // Handle errors, such as network issues, etc.
    }
  };
  return (
    <HeadStack.Navigator
      initialRouteName="ho2"
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#2f3640' },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
        headerRight: () => (
          <HeaderRightContent navigation={navigation} userRole={userRole} onSignOut={handleSignOutPress} />
        ),
      })}
    >
      <HeadStack.Screen
        name="ho2"
        component={Home} 
        initialParams={{ category: 'headphones' }} // Set the initial category title
        options={{
          title: 'Headphones',
        }}
      />
      <HeadStack.Screen
        name="Signin"
        component={SignInForm}
        options={{
          title: 'Sign In',
          headerBackTitleVisible: false, // Ensure back button doesn't show the title
        }}
      />
      <HeadStack.Screen
        name="Signup"
        component={SignUpForm}
        options={{
          title: 'Sign Up',
          headerBackTitleVisible: false, // Ensure back button doesn't show the title
        }}
      />
    </HeadStack.Navigator>
  );
}

const InStack = createStackNavigator();

function InStackScreen() {
  

  
  return (
    <InStack.Navigator
      initialRouteName="Signin"
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#2f3640' },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
        
      })}
    >
      <InStack.Screen
        name="Signin"
        component={SignInForm} 
        options={{
          title: 'Sign In',
        }}
      />
      
      <InStack.Screen
        name="Signup"
        component={SignUpForm}
        options={{
          title: 'Sign Up',
          headerBackTitleVisible: false, // Ensure back button doesn't show the title
        }}
      />
    </InStack.Navigator>
  );
}

const OutStack = createStackNavigator();

function OutStackScreen() {
  

  
  return (
    <OutStack.Navigator
      initialRouteName="Signup"
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#2f3640' },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
        
      })}
    >
      
      <OutStack.Screen
        name="Signin"
        component={SignInForm}
        options={{
          title: 'Sign In',
          headerBackTitleVisible: false, // Ensure back button doesn't show the title
        }}
      />
      <OutStack.Screen
        name="Signup"
        component={SignUpForm}
        options={{
          title: 'Sign Up',
          headerBackTitleVisible: false, // Ensure back button doesn't show the title
        }}
      />
    </OutStack.Navigator>
  );
}
const MobStack = createStackNavigator();

function MobStackScreen({navigation}) {
  const userRole = useSelector((state) => state.Rolee);
  const dispatch = useDispatch();

  const handleSignOutPress = async () => {
    try {
      await R1(); // Call the sign-out function
      dispatch(Role("guest"));
      navigation.navigate('All');
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Error during sign-out:', error);
      // Handle errors, such as network issues, etc.
    }
  };
  return (
    <MobStack.Navigator
      initialRouteName="ho3"
      screenOptions={({ navigation }) => ({
        //headerRight: () => <SignOutButton navigation={navigation} />,
        headerStyle: { backgroundColor: '#2f3640' },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
        headerRight: () => (
          <HeaderRightContent navigation={navigation} userRole={userRole} onSignOut={handleSignOutPress} />
        ),
      })}
    >
      
       <MobStack.Screen
        name="ho3"
        component={Home} 
        initialParams={{ category: 'mobile' }} // Set the initial category title
        options={{
          title: 'Mobile',
        }}
      />
      <MobStack.Screen
        name="Signin"
        component={SignInForm}
        options={{
          title: 'Sign In',
          headerBackTitleVisible: false, // Ensure back button doesn't show the title
        }}
      />
      <MobStack.Screen
        name="Signup"
        component={SignUpForm}
        options={{
          title: 'Sign Up',
          headerBackTitleVisible: false, // Ensure back button doesn't show the title
        }}
      />
    </MobStack.Navigator>
      
  );
}

const LapStack = createStackNavigator();

function LapStackScreen({navigation}) {
  const userRole = useSelector((state) => state.Rolee);
  const dispatch = useDispatch();

  const handleSignOutPress = async () => {
    try {
      await R1(); // Call the sign-out function
      dispatch(Role("guest"));
      navigation.navigate('All');
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Error during sign-out:', error);
      // Handle errors, such as network issues, etc.
    }
  };
  return (
    <LapStack.Navigator
      initialRouteName="ho4"
      screenOptions={({ navigation }) => ({
        //headerRight: () => <SignOutButton navigation={navigation} />,
        headerStyle: { backgroundColor: '#2f3640' },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
        headerRight: () => (
          <HeaderRightContent navigation={navigation} userRole={userRole} onSignOut={handleSignOutPress} />
        ),
      })}
    >
      
       <LapStack.Screen
        name="ho4"
        component={Home} 
        initialParams={{ category: 'laptop' }} // Set the initial category title
        options={{
          title: 'Laptop',
        }}
      />
      <LapStack.Screen
        name="Signin"
        component={SignInForm}
        options={{
          title: 'Sign In',
          headerBackTitleVisible: false, // Ensure back button doesn't show the title
        }}
      />
      <LapStack.Screen
        name="Signup"
        component={SignUpForm}
        options={{
          title: 'Sign Up',
          headerBackTitleVisible: false, // Ensure back button doesn't show the title
        }}
      />
    </LapStack.Navigator>
      
  );
}

const OthStack = createStackNavigator();

function OthStackScreen({navigation}) {
  const userRole = useSelector((state) => state.Rolee);
  const dispatch = useDispatch();

  const handleSignOutPress = async () => {
    try {
      await R1(); // Call the sign-out function
      dispatch(Role("guest"));
      navigation.navigate('All');
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Error during sign-out:', error);
      // Handle errors, such as network issues, etc.
    }
  };
  return (
    <OthStack.Navigator
      initialRouteName="ho5"
      screenOptions={({ navigation }) => ({
        //headerRight: () => <SignOutButton navigation={navigation} />,
        headerStyle: { backgroundColor: '#2f3640' },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
        headerRight: () => (
          <HeaderRightContent navigation={navigation} userRole={userRole} onSignOut={handleSignOutPress} />
        ),
      })}
    >
      
        <OthStack.Screen
        name="ho5"
        component={Home} 
        initialParams={{ category: 'other' }} // Set the initial category title
        options={{
          title: 'Others',
        }}
      />
      <OthStack.Screen
        name="Signin"
        component={SignInForm}
        options={{
          title: 'Sign In',
          headerBackTitleVisible: false, // Ensure back button doesn't show the title
        }}
      />
      <OthStack.Screen
        name="Signup"
        component={SignUpForm}
        options={{
          title: 'Sign Up',
          headerBackTitleVisible: false, // Ensure back button doesn't show the title
        }}
      />
    </OthStack.Navigator>
      
  );
}

import { TouchableOpacity } from 'react-native';


const AddStack = createStackNavigator();

const AddStackScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleSignOutPress = async () => {
    try {
      await R1(); // Call the sign-out function
      dispatch(Role("guest"));
      navigation.navigate('All'); // Replace 'SignInScreen' with the actual screen name
      await AsyncStorage.removeItem('token');

    } catch (error) {
      console.error('Error during sign-out:', error);
      // Handle errors, such as network issues, etc.
    }
  };

  return (
    <AddStack.Navigator
      initialRouteName="Add"
      screenOptions={{
        headerRight: () => <HeaderRight onPress={handleSignOutPress} />,
        headerStyle: { backgroundColor: '#2f3640' },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
      }}
    >
      <AddStack.Screen name="Add" component={AddProductForm} options={{ title: 'Add Item' }} />
      
    </AddStack.Navigator>
  );
};

const HeaderRight = ({ onPress }) => (
  <TouchableOpacity
    style={{ marginRight: 10 }}
    onPress={onPress} // Call the provided function when TouchableOpacity is pressed
  >
    <Text style={{ color: 'white' }}>Sign Out</Text>
  </TouchableOpacity>
);

const R1 = async () => {
  console.warn('s');
  try {
    // Assume you have stored the user token in AsyncStorage
    const userToken = await AsyncStorage.getItem('token');
    console.warn(userToken);
    // Make a request to your sign-out API
    const response = await axios.post('http://192.168.1.104:2001/signout', {}, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    // Check the response status and take appropriate actions
    if (response.status !== 200) {
      // Handle other status codes if needed
      console.error('Sign-out failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error during sign-out:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
};



const DelStack = createStackNavigator();

function DelStackScreen({navigation}) {
  const dispatch = useDispatch();

  const handleSignOutPress = async () => {
    try {
      await R1(); // Call the sign-out function
      dispatch(Role("guest"));
      navigation.navigate('All'); // Replace 'SignInScreen' with the actual screen name
      await AsyncStorage.removeItem('token');

    } catch (error) {
      console.error('Error during sign-out:', error);
      // Handle errors, such as network issues, etc.
    }
  };
  return (
    <DelStack.Navigator
      initialRouteName="delete"
      screenOptions={({ navigation }) => ({
        headerRight: () => <HeaderRight onPress={handleSignOutPress} />,
        headerStyle: { backgroundColor: '#2f3640' },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
      })}
    >
      <DelStack.Screen name="delete"  component={Delete} options={{
          title: 'Delete Item',
        }}/>
      
    </DelStack.Navigator>
  );
}

const UpStack = createStackNavigator();

function UpStackScreen({navigation}) {
  const dispatch = useDispatch();

  const handleSignOutPress = async () => {
    try {
      await R1(); // Call the sign-out function
      dispatch(Role("guest"));
      navigation.navigate('All'); // Replace 'SignInScreen' with the actual screen name
      await AsyncStorage.removeItem('token');

    } catch (error) {
      console.error('Error during sign-out:', error);
      // Handle errors, such as network issues, etc.
    }
  };
  return (
    <UpStack.Navigator
      initialRouteName="Up"
      screenOptions={({ navigation }) => ({
        headerRight: () => <HeaderRight onPress={handleSignOutPress} />,
        headerStyle: { backgroundColor: '#2f3640' },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
      })}
    >
      <UpStack.Screen name="Up"  component={Update} options={{
          title: 'Update Item',
        }}/>
     
    </UpStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

function ProfStackScreen({navigation}) {
  const dispatch = useDispatch();

  const handleSignOutPress = async () => {
    try {
      await R1(); // Call the sign-out function
      dispatch(Role("guest"));
      navigation.navigate('All'); // Replace 'SignInScreen' with the actual screen name
      await AsyncStorage.removeItem('token');

    } catch (error) {
      console.error('Error during sign-out:', error);
      // Handle errors, such as network issues, etc.
    }
  };
  return (
    <ProfileStack.Navigator
      initialRouteName="pr"
      screenOptions={({ navigation }) => ({
        headerRight: () => <HeaderRight onPress={handleSignOutPress} />,
        headerStyle: { backgroundColor: '#2f3640' },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
      })}
    >
      <ProfileStack.Screen name="pr"  component={ProfileScreen} options={{
          title: 'Dashboard',
        }}/>
     
    </ProfileStack.Navigator>
  );
}
const Tab = createBottomTabNavigator();

export default function App() {
  const rotationValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;

  const rotateInterpolate = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scaleInterpolate = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5], // You can adjust the scaling factor as needed
  });
  const userRole = useSelector((state) => state.Rolee);
  const dispatch = useDispatch();

  return (
    
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          showLabel: false,
          inactiveTintColor: 'gray',
        }}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: hp(0.5),
            left: hp(2),
            right: hp(2),
            height: hp(10),
            backgroundColor: "#2f3640",
            borderRadius: hp(2),
          },
        }}
      >
       {userRole==="admin" && (
        <>
        <Tab.Screen
          name="Add Item1"
          component={AddStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome5
                  name="add-circle"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Home tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />

        <Tab.Screen
          name="Delete Item1"
          component={DelStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome
                  name="delete"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />

<Tab.Screen
          name="Update Item1"
          component={UpStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome1
                  name="update"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />

<Tab.Screen
          name="Dashboard1"
          component={ProfStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome2
                  name="bar-graph"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />

        
        </>
       )} 
       {userRole==="guest" && (
        <>
        <Tab.Screen
          name="All1"
          component={HomeStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome11
                  name="home"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />

<Tab.Screen
          name="Head1"
          component={HeadStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome12
                  name="headphones-simple"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />

<Tab.Screen
          name="laptop1"
          component={LapStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome11
                  name="laptop"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />

<Tab.Screen
          name="mobile1"
          component={MobStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome2
                  name="mobile"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />

<Tab.Screen
          name="other1"
          component={OthStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome13
                  name="devices-other"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />
        </>
       )}
         {
          userRole==="customer" && (
            <>
            <Tab.Screen
          name="All"
          component={HomeStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome11
                  name="home"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />

<Tab.Screen
          name="Head"
          component={HeadStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome12
                  name="headphones-simple"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />

<Tab.Screen
          name="laptop"
          component={LapStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome11
                  name="laptop"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />

<Tab.Screen
          name="mobile"
          component={MobStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome2
                  name="mobile"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />

<Tab.Screen
          name="other"
          component={OthStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome13
                  name="devices-other"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />


<Tab.Screen
          name="cart1"
          component={CartStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome2
                  name="shopping-cart"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />
        <Tab.Screen
          name="profile"
          component={ProfStackScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    { rotate: focused ? rotateInterpolate : '0deg' },
                    { scale: focused ? scaleInterpolate : 1 },
                  ],
                }}
              >
                <FontAwesome1
                  name="face-man-profile"
                  size={size}
                  color={focused ? 'white' : color}
                />
              </Animated.View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Reset the rotation and scale values to start the animation every time the Settings tab is pressed
              rotationValue.setValue(0);
              scaleValue.setValue(0);
              Animated.parallel([
                Animated.timing(rotationValue, {
                  toValue: 1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            },
          })}
        />

            </>
          )
         } 
      </Tab.Navigator>

      
    </NavigationContainer>
  );
}
