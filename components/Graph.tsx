import * as React from "react";
import { View, Dimensions, StyleSheet, Text } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { scaleTime, scaleLinear } from "d3-scale";
import * as shape from "d3-shape";
import Dash from 'react-native-dash';

import Cursor from "./Cursor";

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

export default ({ data }: GraphProps) => {
  const min = getDomain(data.map(d => d.value))[0];
  const max = getDomain(data.map(d => d.value))[1];
  const avr = (min + max) / 2;
  const scaleX = scaleTime()
    .domain(getDomain(data.map(d => d.date)))
    .range([0, width]);
  const scaleY = scaleLinear()
    .domain(getDomain(data.map(d => d.value)))
    .range([height - padding, padding]);
  const d = shape
    .line<DataPoint>()
    .x(p => scaleX(p.date))
    .y(p => scaleY(p.value))
    .curve(shape.curveBasis)(data) as string;
  return (
    <View style={styles.container}>
      <View style={styles.domainWrapper}>
        <View>
          <View style={{ flex: 1 }}>
            <Text style={styles.graphDomains}>₺{max} </Text>
          </View>
          <View style={{ flex: 4 }}>
            <Dash dashThickness={0.4} dashColor="#999" style={styles.graphDomainLine} />
          </View>
        </View>
        <View>
          <View style={{ flex: 1 }}>
            <Text style={styles.graphDomains}>₺{avr} </Text>
          </View>
          <View style={{ flex: 4 }}>
            <Dash dashThickness={0.4} dashColor="#999" style={styles.graphDomainLine} />
          </View>
        </View>
        <View>
          <View style={{ flex: 1 }}>
            <Text style={styles.graphDomains}>₺{min} </Text>
          </View>
          <View style={{ flex: 4 }}>
            <Dash dashThickness={0.4} dashColor="#999" style={styles.graphDomainLine} />
          </View>
        </View>
      </View>
      <Svg style={[StyleSheet.absoluteFill, { zIndex: 1, }]}>
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
        />
        <Path fill="transparent" stroke="#3977e3" {...{ d, strokeWidth }} />
      </Svg>
      <Cursor
        {...{ d }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: '#fff'
  },
  domainWrapper: {
    marginTop: height * 0.2,
    height: height * 0.8,
    flex: 1,
    justifyContent: 'space-between',
    position: 'absolute',
    width: width,
    zIndex: 5
  },
  graphDomains: {
    color: '#999',
  },
  graphDomainLine: {
    width: width,
  }
});
