/* eslint-disable camelcase */
import Animated from "react-native-reanimated";

const initial_graph_State = {
    yPoint: new Animated.Value(0),
    balances: null,
    data: []
};

export default (state = initial_graph_State, action) => {
    switch (action.type) {
        case 'yPoint_changed':
            return { ...state, yPoint: action.payload };
        case 'rates_changed':
            return { ...state, balances: action.payload };
        case 'currency_changed':
            return { ...state, data: action.payload };
        default:
            return state;
    }
};
