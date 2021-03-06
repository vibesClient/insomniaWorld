import * as React from "react";
import { View, Dimensions, StyleSheet, Text, ActivityIndicator, Animated } from "react-native";
import { connect } from 'react-redux';
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { scaleTime, scaleLinear } from "d3-scale";
import * as shape from "d3-shape";
import Dash from 'react-native-dash';
import Cursor from "./Cursor";
import { interpolatePath } from 'd3-interpolate-path'

interface DataPoint {
  date: number;
  value: number;
}

interface GraphProps {
  data: DataPoint[];
}

const φ = (1 + Math.sqrt(5)) / 2;
const { width, height: wHeight } = Dimensions.get("window");
const height = (1 - 1 / φ) * 400;
const strokeWidth = 2;
const padding = strokeWidth / 2;
const getDomain = (domain: number[]) => [
  Math.min(...domain),
  Math.max(...domain)
];

class Graph extends React.Component {
  state = {
    animation: new Animated.Value(0)
  }

  openAnimation = () => {
    const bouncedDuration = 20;
    Animated.sequence([
      Animated.timing(this.state.animation, {
        toValue: 0,
        duration: 200
      }),
      Animated.timing(this.state.animation, {
        toValue: 1.3,
        duration: 250
      }),
      Animated.timing(this.state.animation, {
        toValue: 1.25,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 1.2,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 1.15,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 1.10,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 1.05,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 0.95,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 0.90,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 0.85,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 0.90,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 0.95,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 1.05,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 1.1,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 1.15,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 1.1,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 1.05,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 0.95,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 0.90,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 0.95,
        duration: bouncedDuration
      }),
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: bouncedDuration
      }),
    ]).start();
  }

  render() {
    if (this.props.data.length < 1) {
      return (<ActivityIndicator />);
    } else {
      const graphData: GraphProps = this.props.data;
      const min = getDomain(graphData.map(d => d.value))[0];
      const max = getDomain(graphData.map(d => d.value))[1];
      const avr = (min + max) / 2;
      const scaleX = scaleTime()
        .domain(getDomain(graphData.map(d => d.date)))
        .range([0, width]);
      const scaleY = scaleLinear()
        .domain(getDomain(graphData.map(d => d.value)))
        .range([height - padding, padding]);

      const d = shape
        .line<DataPoint>()
        .x(p => scaleX(p.date))
        .y(p => scaleY(p.value))
        .curve(shape.curveBasis)(graphData) as string;
      const d2 = shape
        .line<DataPoint>()
        .x(p => scaleX(p.date))
        .y(p => scaleY(0))
        .curve(shape.curveBasis)(graphData) as string;

      const pathInterpolate = interpolatePath(d2, d)
      this.state.animation.addListener(({ value }) => {
        const path = pathInterpolate(value);
        this._path.setNativeProps({
          d: path
        })
      })
      this.openAnimation();

      return (
        <View style={styles.container}>
          {/* ----grafiğin solunda max, min ve ortalama değeri gösteren çizgiler
            isteğe göre eklemek için yorum satırlarını kaldırınız.----

          <View style={styles.domainWrapper}>
            <View>
              <Dash dashThickness={0.4} dashColor="#999" style={styles.graphDomainLine} />
              <Text style={styles.graphDomains}> {max.toFixed(0)} </Text>
            </View>
            <View>
              <Dash dashThickness={0.4} dashColor="#999" style={styles.graphDomainLine} />
              <Text style={styles.graphDomains}> {avr.toFixed(0)} </Text>
            </View>
            <View>
              <Text style={styles.graphDomains}> {min.toFixed(0)} </Text>
              <Dash dashThickness={0.4} dashColor="#999" style={styles.graphDomainLine} />
            </View>
          </View>
        */}
          < Svg style={[StyleSheet.absoluteFill, { zIndex: 1 }]} >
            <Defs>
              <LinearGradient id="gradient" x1="50%" y1="0%" x2="50%" y2="100%">
                <Stop offset="0%" stopColor="#cee3f9" stopOpacity="0.6" />
                <Stop offset="80%" stopColor="#ddedfa" stopOpacity="0.6" />
                <Stop offset="100%" stopColor="#feffff" stopOpacity="0.6" />
              </LinearGradient>
            </Defs>
            <Path
              d={`${d}L ${width} ${height} L 0 ${height}`}
              fill="url(#gradient)"
              ref={path => this._path = path}
            />
            <Path d={d} ref={path => this._path = path} fill="transparent" stroke="#3977e3" {...{ strokeWidth }} />
          </Svg >
          <Cursor
            {...{ d }}
          />
        </View >
      );
    }
  }
};

const styles = StyleSheet.create({
  container: {
    width,
    height
  },
  domainWrapper: {
    marginTop: height * 0.2,
    height: height * 0.8,
    flex: 1,
    justifyContent: 'space-between',
    position: 'absolute',
    width: width,
    zIndex: 50
  },
  graphDomains: {
    color: '#999',
    fontSize: 14
  },
  graphDomainLine: {
    width: width * 0.91,
    alignSelf: "flex-end"
  }
});

const mapStateToProps = state => {
  const { data } = state.graph;
  return {
    data
  };
};


export default connect(mapStateToProps, {})(Graph);