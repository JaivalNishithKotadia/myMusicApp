import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import React, {useEffect} from 'react';
import Home from './screens/Home';
import Search from './screens/Search';

import {
  NavigationContainer,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useMaterialYou} from '@assembless/react-native-material-you';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Music from './screens/Music';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const height = Dimensions.get('window');
const TabNavigator = () => {
  const {palette} = useMaterialYou({});

  const primary40 = palette.system_accent1[8];
  return (
    <Tab.Navigator
      initialRouteName="Stack"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          borderColor: 'black',
          borderRadius: 36,
          height: 70,
          ...styles.shadow,
          marginHorizontal: 50,
          shadowColor: primary40,
          backgroundColor: palette.system_accent1[11],
        },
        tabBarShowLabel: false,

        animation: 'shift',
        tabBarIcon: ({focused}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'Home';
          } else if (route.name === 'Search') {
            iconName = 'Search';
          }
          return (
            <Icon name={route.name} iconName={iconName} focused={focused} />
          );
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
    </Tab.Navigator>
  );
};

const Icon = ({name, iconName}: any) => {
  const {palette} = useMaterialYou({});

  const primary40 = palette.system_accent1[8];
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const scale = useSharedValue(1);

  let iconSource;
  if (iconName == 'Home') {
    iconSource = require('../assets/icons/stack.png');
  } else {
    iconSource = require('../assets/icons/search.png');
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: withTiming(scale.value, {duration: 150})}], // Apply animated scale transformation
    };
  });
  React.useEffect(() => {
    scale.value = isFocused ? 1.1 : 1;
  }, [isFocused]);
  const handlePress = () => {};

  return (
    <Animated.View style={[styles.iconContainer, animatedStyles]}>
      {/* Your icon component */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(name);
          handlePress();
        }}>
        <View
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',

              flexDirection: 'column',
              bottom: 23,
              minWidth: 60,
              minHeight: 60,
            },
          ]}>
          <Image
            source={iconSource}
            style={{
              width: 25,
              height: 25,
              tintColor: isFocused ? primary40 : '#748c94',
            }}
            resizeMode="contain"
          />

          <Text
            style={{
              color: isFocused ? primary40 : '#748c94',
              fontSize: 14,
              fontFamily: 'ClashDisplay-Medium',
            }}>
            {iconName}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
function App() {
  // Example usage:

  const requestFilePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestFilePermission();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'vertical',
          gestureResponseDistance: height.height / 2,
        }}
        initialRouteName="Home">
        <Stack.Screen
          name="Tab"
          component={TabNavigator}
          options={{
            ...TransitionPresets.ModalTransition,
          }}
        />
        <Stack.Screen
          name="Music"
          component={Music}
          options={{
            ...TransitionPresets.ModalTransition,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    width: 38,
    borderRadius: 19,
  },
  image: {
    width: 200,
    height: 200,
    tintColor: 'white', // Apply your desired tint color here
  },
});
export default App;
