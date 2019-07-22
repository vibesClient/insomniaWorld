/* eslint-disable camelcase */
import Animated from "react-native-reanimated";

const initial_graph_State = {
    yPoint: new Animated.Value(0),
    balances: null,
    data: [],
    scrollData: [],
    i: 0,
    cA: []
};

export default (state = initial_graph_State, action) => {
    switch (action.type) {
        case 'yPoint_changed':
            return { ...state, yPoint: action.payload };
        case 'rates_changed':
            return { ...state, balances: action.payload, i:0 };
        case 'currency_changed':
            return { ...state, data: action.payload.data, i:0, cA: action.payload.cA };
        case 'scrollData_changed':
            return { ...state, scrollData: action.payload, i:0 };
        case 'dataArrayIndex_changed':
            return { ...state, i: action.payload };
        default:
            return state;
    }
};
