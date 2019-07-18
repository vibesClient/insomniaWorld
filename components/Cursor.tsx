import React, { Component } from 'react';
import { View, StyleSheet, Text } from "react-native";
import { connect } from 'react-redux';
import Animated from "react-native-reanimated";
import { parsePath, getPointAtLength } from "react-native-redash";
import { tooltipChanged } from '../actions';

const { sub, interpolate } = Animated;
const TOUCH_SIZE = 400;
const white = "white";
let i = 0;
class Cursor extends Component {

  render() {    
    /*cursorun konumu scroll ile eşitleniyor */
    let scrollItemsLength = 0;
    this.props.scrollData.forEach(sc => {
      scrollItemsLength += sc.data.length;
    });
    const scrollLength = (scrollItemsLength * 50) + (this.props.scrollData.length * 40) - 220;

    /*cursorun konumunu değiştiren animasyon */
    const radius = 10;
    const cx = this.props.yPoint;
    const path = parsePath(this.props.d);
    const length = interpolate(cx, {
      inputRange: [0, scrollLength],
      outputRange: [(path.totalLength - path.totalLength*0.01), -(path.totalLength*0.008)]
    });
    const { y, x } = getPointAtLength(path, length);
    const translateX: any = sub(x, TOUCH_SIZE / 2);
    const translateY: any = sub(y, TOUCH_SIZE / 2);
    
    return (
      <View style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}>
        {/*cursor şekli oluşturuluyor ve hareketedebilmesi için
             Animated.View'in içerisine alınıyor */}
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
  const { yPoint, scrollData, tooltip } = state.graph;
  return {
    yPoint,
    scrollData,
    tooltip
  };
};


export default connect(mapStateToProps, { tooltipChanged })(Cursor);