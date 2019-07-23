import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { connect } from 'react-redux';
import Animated from "react-native-reanimated";
import { parsePath, getPointAtLength } from "react-native-redash";
import { changeDataArrayIndex } from '../actions';

const { sub, interpolate } = Animated;
const TOUCH_SIZE = 400;
const white = "white";
class Cursor extends Component {
  render() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let scrollItemsLength = 0;
    this.props.scrollData.forEach(sc => {
      scrollItemsLength += sc.data.length;
    });
    const scrollLength = (scrollItemsLength * 50) + (this.props.scrollData.length * 40) - 220;
    const section = scrollLength / this.props.scrollData.length;

    const radius = 10;
    const cx = this.props.yPoint;
    const path = parsePath(this.props.d);

    let reversePath = [];
    path.segments.reverse().forEach(sg => {
      reversePath.push(sg);
    })
    path.segments.reverse();

    const dene = (index) => {
      for (let i = 0; i < reversePath.length - 1; i++) {
        if (index >= parseInt(reversePath[i].start) && index <= parseInt(reversePath[i].end)) {
          this.props.changeDataArrayIndex(i);
          break;
        }
      }
    }
    const setTranslation = ([index]: [number]) => {
      dene(parseInt(index))
    }

    /*cursorun konumunu değiştiren animasyon */

    const length = interpolate(cx, {
      inputRange: [0, scrollLength],
      outputRange: [(path.totalLength - path.totalLength * 0.01), -(path.totalLength * 0.008)]
    });
    const { y, x } = getPointAtLength(path, length);
    const translateX: any = sub(x, TOUCH_SIZE / 2);
    const translateY: any = sub(y, TOUCH_SIZE / 1.8);

    const tooltipMarginLeft = interpolate(cx, {
      inputRange: [0, scrollLength],
      outputRange: [0, 150]
    });

    const tooltipMarginRight = interpolate(cx, {
      inputRange: [0, scrollLength],
      outputRange: [150, 0]
    });

    const dateTime =
      typeof this.props.scrollData[this.props.i] == "object"
        ?
        (<Text>
          {new Date(this.props.scrollData[this.props.i].title).getDate() + ' ' +
            months[new Date(this.props.scrollData[this.props.i].title).getMonth()]}
        </Text>)
        : <ActivityIndicator />;

    const price =
      typeof this.props.scrollData[this.props.i] == "object"
        ?
        (<Text>
          {this.props.scrollData[this.props.i].price}
        </Text>)
        : <ActivityIndicator />;

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
          <Animated.View
            style={{
              width: 150,
              backgroundColor: '#f4f4f4',
              opacity: 0.75,
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderRadius: 15,
              marginRight: tooltipMarginRight,
              marginLeft: tooltipMarginLeft
            }}
          >
            <Animated.Code>
              {
                () => Animated.call([length], setTranslation)
              }
            </Animated.Code>
            {dateTime}
            {price}
          </Animated.View>

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
  const { yPoint, scrollData, i, cA } = state.graph;
  return {
    yPoint,
    scrollData,
    i,
    cA
  };
};


export default connect(mapStateToProps, { changeDataArrayIndex })(Cursor);