/* eslint-disable camelcase */
import Animated from "react-native-reanimated";

const initial_graph_State = {
    yPoint: new Animated.Value(0),
    balances: null,
    data: [],
    scrollData: [],
    tooltip: []
};

export default (state = initial_graph_State, action) => {
    switch (action.type) {
        case 'yPoint_changed':
            return { ...state, yPoint: action.payload };
        case 'rates_changed':
            return { ...state, balances: action.payload };
        case 'currency_changed':
            return { ...state, data: action.payload };
        case 'scrollData_changed':
            return { ...state, scrollData: action.payload };
        case 'tooltip_changed':
            return { ...state, tooltip: action.payload };
        default:
            return state;
    }
};
