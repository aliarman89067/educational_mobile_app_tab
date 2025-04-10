import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const { width, height } = Dimensions.get("window");

const RotatingTabs = () => {
  const rotation = useRef(new Animated.Value(0)).current;
  const rotationValue = useRef(0);
  const startTouchAngle = useRef(0); // Stores the initial touch angle

  const center = { x: 150, y: 150 }; // center of the circle

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gesture) => {
        const initialX = gesture.x0 - (width / 2 - 150);
        const initialY = gesture.y0 - (height - 150 - 100);
        const initialAngle = Math.atan2(
          initialY - center.y,
          initialX - center.x
        );
        startTouchAngle.current = initialAngle * (180 / Math.PI);
      },
      onPanResponderMove: (_, gesture) => {
        const x = gesture.moveX - (width / 2 - 150);
        const y = gesture.moveY - (height - 150 - 100);
        const angle = Math.atan2(y - center.y, x - center.x);
        const degrees = angle * (180 / Math.PI);
        const angleDiff = degrees - startTouchAngle.current;
        let newRotation = rotationValue.current + angleDiff;
        newRotation = newRotation % 360;
        if (newRotation < 0) newRotation += 360;
        rotationValue.current = newRotation;
        rotation.setValue(newRotation);
        startTouchAngle.current = degrees;
      },
      onPanResponderRelease: (_, gesture) => {},
    })
  ).current;

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        renderToHardwareTextureAndroid={true}
        style={[styles.circle, { transform: [{ rotate: rotateInterpolate }] }]}
        {...panResponder.panHandlers}
      >
        {/* Top */}
        <View
          style={[
            styles.icon,
            { top: 5, left: "50%", transform: [{ translateX: -20 }] },
          ]}
        >
          <Entypo name="home" size={20} color="black" />
        </View>

        {/* Bottom */}
        <View
          style={[
            styles.icon,
            { bottom: 5, left: "50%", transform: [{ translateX: -20 }] },
          ]}
        >
          <FontAwesome5 name="user-alt" size={20} color="black" />
        </View>

        {/* Left */}
        <View
          style={[
            styles.icon,
            { top: "50%", left: 5, transform: [{ translateY: -20 }] },
          ]}
        >
          <FontAwesome6 name="newspaper" size={20} color="black" />
        </View>

        {/* Right */}
        <View
          style={[
            styles.icon,
            { top: "50%", right: 5, transform: [{ translateY: -20 }] },
          ]}
        >
          <FontAwesome name="users" size={20} color="black" />
        </View>

        <View style={styles.innerCircle} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -150 }],
    bottom: -100,
  },
  circle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    position: "absolute",
    zIndex: 10,
  },
  innerCircle: {
    width: 200,
    height: 200,
    backgroundColor: "white",
    borderRadius: 100,
  },
});

export default RotatingTabs;
