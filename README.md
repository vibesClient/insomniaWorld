redux yapısı için gerekli dependenci
import { connect } from 'react-redux';
//https://github.com/reduxjs/react-redux

şekil çizmek için gerekli dependenci
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
//https://github.com/react-native-community/react-native-svg

grafik şekli için gerekli dependencies
import { scaleTime, scaleLinear } from "d3-scale";
//https://github.com/d3/d3-scale
import * as shape from "d3-shape";
//https://www.npmjs.com/package/d3-shape
import { interpolatePath } from 'd3-interpolate-path'
//https://github.com/pbeshai/d3-interpolate-path

grafiğin üzerinde yatay çizgiler oluşturmak için gerekli dependenci
//bu özellik yorum satırına alınarak devre dışı bırakılmıştır. graph.tsx dosyası içinde 
import Dash from 'react-native-dash';
//https://github.com/obipawan/react-native-dash

yüksek fps'de animasyonlar oluştrabilmek için gerekli dependenci
import Animated from "react-native-reanimated";
//https://github.com/kmagiera/react-native-reanimated

cursor konumunu ayarlayabilmek için gerekli dependenci
import { parsePath, getPointAtLength } from "react-native-redash";
//https://github.com/wcandillon/react-native-redash

ikonlar için gerekli dependenci
import Icon from 'react-native-vector-icons/FontAwesome5';
//https://github.com/oblador/react-native-vector-icons/blob/master/FONTAWESOME5.md

reklam banner'ında ve wallet'ların gösterildiği yerde kullandığımız carousel yapısı için gerekli dependenci
import Carousel from 'react-native-carousel-view';
//https://github.com/chilijung/react-native-carousel-view

veriye göre oluşturulan grafik için gerekli component. ayrıca bu component'te bounce efekti de 
import Graph from "./Graph";

grafik üzerindeki cursorun oluşturulduğu ve redux'dan aldığı veriye göre hareket ettirildiği component
import Cursor from "./Cursor";
