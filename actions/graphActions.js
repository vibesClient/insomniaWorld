/*scroll hareket ettirildiğinde tetiklenen bu method, scroll konumunu içeren animatedValue tipindeki
veriyi reducer'a iletir ve veri state'e yazılır. */
export const yPointChanged = (y) => (dispatch) => {
        
    dispatch({
        type: "yPoint_changed",
        payload: y
    })
}

/*tarih ve tarihe bağlı girdi çıktıyı içeren totalBalance dizisini parametre olarak alır
dizinin elemanlarını dolaşarak her bir wallet için toplam miktarı hesaplar ve reducer'a bir dizi döner
reducer'a giden wallets dizisi state'e yazılır. */
export const convertRates = (totalBalance) => (dispatch) => {
    //0: euro, 1: dolar, 2: tl
    let wallets = []
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
    wallets[0] = "€" + tb[0].toFixed(2);
    wallets[1] = "$" + tb[1].toFixed(2);
    wallets[2] = "₺" + tb[2].toFixed(2);
    
    dispatch({
        type: "rates_changed",
        payload: wallets
    })

}

/*değişen wallet verisini grafikte gösterebilmek için bu method çalışır
wallet içerisindeki tüm veriler data dizisine push edilir ve reducer'a gönderilir. 
bu veri reducer'da state'e yazılır. */
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

export const walletScrollDataChanged = (scrollData) => (dispatch) => {
       
    dispatch({
        type: "scrollData_changed",
        payload: scrollData
    })
}

export const tooltipChanged = (scrollData) => (dispatch) => {
       
    dispatch({
        type: "tooltip_changed",
        payload: scrollData
    })
}