import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from "react-native";
import { connect } from 'react-redux';
import Animated from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { decay, clamp, parsePath, getPointAtLength } from "react-native-redash";

const { Value, event, sub, interpolate } = Animated;
const TOUCH_SIZE = 400;
const { width } = Dimensions.get("window");
const white = "white";

class Cursor extends Component {
  render() {
    
    const radius = 10;
    const translationX = new Value(0);
    const velocityX = new Value(16);
    const state = new Value(State.UNDETERMINED);

    const cx = this.props.yPoint;
    const path = parsePath(this.props.d);
    const length = interpolate(cx, {
      inputRange: [0, width],
      outputRange: [0, path.totalLength]
    });
    const { y, x } = getPointAtLength(path, length);
    const translateX: any = sub(x, TOUCH_SIZE / 2);
    const translateY: any = sub(y, TOUCH_SIZE / 2);

    return (
      <View style={StyleSheet.absoluteFill}>
          <Animated.View
            style={{
              transform: [{ translateX }, { translateY }],
              width: TOUCH_SIZE,
              height: TOUCH_SIZE,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: radius * 2,
                height: radius * 2,
                borderRadius: radius,
                borderColor: "#3977e3",
                borderWidth: 4,
                backgroundColor: white
              }}
            />
          </Animated.View>
      </View>
    );
  }
};

const mapStateToProps = state => {
  const { yPoint } = state.graph;
  return {
    yPoint
  };
};


export default connect(mapStateToProps, {})(Cursor);