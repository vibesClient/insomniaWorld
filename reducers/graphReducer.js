/* eslint-disable camelcase */
import Animated from "react-native-reanimated";

const initial_graph_State = {
    yPoint: new Animated.Value(0)
};

export default (state = initial_graph_State, action) => {
    switch (action.type) {
        case 'yPoint_changed':
            return { ...state, yPoint: action.payload };
        default:
            return state;
    }
};
