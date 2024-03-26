import React, {useEffect, useRef} from 'react';
import {StatusBar, Animated} from 'react-native';

const AnimatedStatusBar = ({backgroundColor}) => {
  const colorAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(colorAnimation, {
      toValue: 1,
      duration: 500, // Adjust the duration as needed
      useNativeDriver: false, // 'backgroundColor' animation doesn't support native driver
    }).start();
  }, [backgroundColor]);

  const interpolatedColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [StatusBar.backgroundColor || '#00000000', backgroundColor],
  });

  return (
    <Animated.View
      style={{
        backgroundColor: interpolatedColor,
        height: StatusBar.currentHeight,
      }}>
      <StatusBar translucent backgroundColor="transparent" />
    </Animated.View>
  );
};

export default AnimatedStatusBar;
