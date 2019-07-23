export const changeDataArrayIndex = (i) => (dispatch) => {
console.log(i);

    dispatch({
        type: "dataArrayIndex_changed",
        payload: i
    })
}


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
            } else {
                tb[i] += d.value;
            }
            j = true;
        })
        i++;
        j = false;
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
export const balanceChanged = (chartData, chartItemsData) => (dispatch) => {
    let scrollItemsLength = 0;
    chartItemsData.forEach(sc => {
        scrollItemsLength += sc.data.length;
    });
    const scrollLength = (scrollItemsLength * 50) + (chartItemsData.length * 40) - 220;

    let carpanlaraAyrilmis = []
    for (let index = 0; index < scrollLength; index++) {
        if (index % parseInt(scrollLength / chartItemsData.length) == 0)
            carpanlaraAyrilmis.push(index)
    }
    
    dispatch({
        type: "currency_changed",
        payload: {"data": chartData, "cA": carpanlaraAyrilmis}
    })
}

export const walletScrollDataChanged = (scrollData) => (dispatch) => {

    dispatch({
        type: "scrollData_changed",
        payload: scrollData
    })
}
