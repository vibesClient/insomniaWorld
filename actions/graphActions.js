export const yPointChanged = (y) => (dispatch) => {
    dispatch({
        type: "yPoint_changed",
        payload: y
    })
}