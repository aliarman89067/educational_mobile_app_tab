import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const { width, height } = Dimensions.get("window");

const RotatingTabs = () => {
  const rotation = useRef(new Animated.Value(0)).current;
  const rotationValue = useRef(0);
  const startTouchAngle = useRef(0);
  const center = { x: 150, y: 150 };

  type ActiveTabsType = "Home" | "History" | "Friends" | "Profile";

  const [activeTab, setActiveTab] = useState<ActiveTabsType>("Home");

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

        if (Math.abs(angleDiff) > 180) {
          newRotation += angleDiff > 0 ? -360 : 360;
        }

        newRotation = ((newRotation % 360) + 360) % 360;

        rotationValue.current = newRotation;
        startTouchAngle.current = degrees;

        Animated.timing(rotation, {
          toValue: newRotation,
          duration: 20,
          useNativeDriver: false,
        }).start();

        if (newRotation >= 355 || newRotation <= 5) {
          rotationValue.current = newRotation >= 355 ? 0 : newRotation;
          rotation.setValue(newRotation >= 355 ? 360 : newRotation);
        }
      },
      onPanResponderRelease: () => {
        const snapPoints = [0, 90, 180, 270];
        const current = rotationValue.current;

        const closest = snapPoints.reduce((prev, curr) => {
          const prevDist = Math.min(
            Math.abs(prev - current),
            360 - Math.abs(prev - current)
          );
          const currDist = Math.min(
            Math.abs(curr - current),
            360 - Math.abs(curr - current)
          );
          return currDist < prevDist ? curr : prev;
        });
        handleActiveIcon(closest);
        let target = closest;
        if (current > 315 && closest === 0) {
          target = 360;
        }

        Animated.timing(rotation, {
          toValue: target,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start(() => {
          if (target === 360) {
            rotation.setValue(0);
            rotationValue.current = 0;
          } else {
            rotationValue.current = closest;
          }
        });
      },
    })
  ).current;

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const handleActiveIcon = (closest: number) => {
    if (closest === 0) {
      setActiveTab("Home");
    } else if (closest === 90) {
      setActiveTab("History");
    } else if (closest === 180) {
      setActiveTab("Profile");
    } else {
      setActiveTab("Friends");
    }
  };
  return (
    <View style={styles.wrapper}>
      <Animated.View
        renderToHardwareTextureAndroid={true}
        style={[styles.circle, { transform: [{ rotate: rotateInterpolate }] }]}
        {...panResponder.panHandlers}
      >
        {/* Top */}
        <TouchableOpacity
          style={[
            styles.icon,
            { backgroundColor: activeTab === "Home" ? "#666" : "#fff" },
            { top: 5, left: "50%", transform: [{ translateX: -20 }] },
          ]}
        >
          <Entypo
            name="home"
            size={20}
            color={activeTab === "Home" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        {/* Bottom */}
        <TouchableOpacity
          style={[
            styles.icon,
            { backgroundColor: activeTab === "Profile" ? "#666" : "#fff" },
            {
              bottom: 5,
              left: "50%",
              transform: [{ translateX: -20 }, { rotate: "180deg" }],
            },
          ]}
        >
          <FontAwesome5
            name="user-alt"
            size={20}
            color={activeTab === "Profile" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        {/* Left */}
        <TouchableOpacity
          style={[
            styles.icon,
            { backgroundColor: activeTab === "History" ? "#666" : "#fff" },
            {
              top: "50%",
              left: 5,
              transform: [{ translateY: -20 }, { rotate: "-90deg" }],
            },
          ]}
        >
          <FontAwesome6
            name="newspaper"
            size={20}
            color={activeTab === "History" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        {/* Right */}
        <TouchableOpacity
          style={[
            styles.icon,
            { backgroundColor: activeTab === "Friends" ? "#666" : "#fff" },
            {
              top: "50%",
              right: 5,
              transform: [{ translateY: -20 }, { rotate: "90deg" }],
            },
          ]}
        >
          <FontAwesome
            name="users"
            size={20}
            color={activeTab === "Friends" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

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
    bottom: -200,
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
