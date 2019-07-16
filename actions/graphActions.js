export const yPointChanged = (y) => (dispatch) => {
    dispatch({
        type: "yPoint_changed",
        payload: y
    })
}

export const convertRates = (totalBalance) => (dispatch) => {
    //0: euro, 1: dolar, 2: tl
    console.log(totalBalance);
    let balances = []
    let tb = [];
    let i = 0;
    let j = false;
    totalBalance.forEach(data => {
        data.forEach(d => {
            if (!j) {
                tb[i] = d.value;
            }else{
                tb[i] += d.value;
            }
            j=true;            
        })
        i++;
        j=false;
    })
    balances[0] = "€" + tb[0].toFixed(2);
    balances[1] = "$" + tb[1].toFixed(2);
    balances[2] = "₺" + tb[2].toFixed(2);
    
    dispatch({
        type: "rates_changed",
        payload: balances
    })

}

export const balanceChanged = (chartData) => (dispatch) => {
       
    dispatch({
        type: "currency_changed",
        payload: []
    })
    let data = [];
    chartData.forEach(d => {
        data.push({date: d.date, value: d.value});   
    })
    dispatch({
        type: "currency_changed",
        payload: data
    })
}