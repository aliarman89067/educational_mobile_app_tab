import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const RotatingTabs = () => {
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const circleRef = useRef<View>(null);

  // Calculate icon positions based on rotation
  const getIconStyle = (index: number) => {
    const angle = index * 90 * (Math.PI / 180);
    const radius = 130;
    return useAnimatedStyle(() => {
      const currentAngle = angle + rotation.value * (Math.PI / 180);
      return {
        left: 150 + radius * Math.sin(currentAngle) - 20,
        top: 150 + radius * -Math.cos(currentAngle) - 20,
      };
    });
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      savedRotation.value = rotation.value;
    })
    .onUpdate((e) => {
      if (circleRef.current) {
        circleRef.current.measure((x, y, width, height, pageX, pageY) => {
          const centerX = pageX + width / 2;
          const centerY = pageY + height / 2;
          const angle =
            Math.atan2(e.absoluteX - centerX, centerY - e.absoluteY) *
            (180 / Math.PI);
          rotation.value = withSpring(angle, {
            damping: 20,
            stiffness: 100,
          });
        });
      }
    });

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const animatedIconStyle = (index: number) =>
    useAnimatedStyle(() => ({
      transform: [{ rotate: `${-rotation.value}deg` }],
    }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.wrapper}>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            ref={circleRef}
            style={[styles.circle, animatedCircleStyle]}
          >
            {/* Top icon */}
            <Animated.View style={[styles.icon, getIconStyle(0)]}>
              <Entypo
                name="home"
                size={20}
                color="black"
                style={[styles.iconContent, animatedIconStyle(0)]}
              />
            </Animated.View>

            {/* Bottom icon */}
            <Animated.View style={[styles.icon, getIconStyle(2)]}>
              <FontAwesome5
                name="user-alt"
                size={20}
                color="black"
                style={[styles.iconContent, animatedIconStyle(2)]}
              />
            </Animated.View>

            {/* Left icon */}
            <Animated.View style={[styles.icon, getIconStyle(3)]}>
              <FontAwesome6
                name="newspaper"
                size={20}
                color="black"
                style={[styles.iconContent, animatedIconStyle(3)]}
              />
            </Animated.View>

            {/* Right icon */}
            <Animated.View style={[styles.icon, getIconStyle(1)]}>
              <FontAwesome
                name="users"
                size={20}
                color="black"
                style={[styles.iconContent, animatedIconStyle(1)]}
              />
            </Animated.View>

            <View style={styles.innerCircle} />
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  iconContent: {
    transform: [{ rotate: "0deg" }],
  },
  innerCircle: {
    width: 200,
    height: 200,
    backgroundColor: "white",
    borderRadius: 100,
  },
});

export default RotatingTabs;
