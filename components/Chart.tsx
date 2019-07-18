import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    SectionList,
} from 'react-native';
import { Image } from 'react-native-elements';
import Animated from "react-native-reanimated";
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Carousel from 'react-native-carousel-view';
import Graph from "./Graph";
import { yPointChanged, convertRates, balanceChanged, walletScrollDataChanged } from '../actions';

/*animasyonlarda kullanılacak const değişkenler */
const HEADER_MIN_HEIGHT = 100;
const HEADER_MAX_HEIGHT = 350;

/*cihaz genişliği ve yüksekliği çekiliyor */
const { width, height } = Dimensions.get('window');

/*euro cinsinden verileri içeren statik dizi */
const euroData = [
    { date: new Date(2018, 9, 1).getTime(), value: 0 },
    { date: new Date(2018, 9, 16).getTime(), value: 0 },
    { date: new Date(2018, 9, 17).getTime(), value: 300 },
    { date: new Date(2018, 10, 1).getTime(), value: 200 },
    { date: new Date(2018, 10, 2).getTime(), value: 300 },
    { date: new Date(2018, 10, 5).getTime(), value: 100 },
    { date: new Date(2018, 11, 1).getTime(), value: 0 },
    { date: new Date(2018, 11, 16).getTime(), value: 50 },
    { date: new Date(2018, 11, 17).getTime(), value: 500 },
    { date: new Date(2018, 12, 1).getTime(), value: 200 },
    { date: new Date(2018, 12, 2).getTime(), value: 300 },
    { date: new Date(2018, 12, 5).getTime(), value: 100 }
];

/*dolar cinsinden verileri içeren statik dizi */
const dolarData = [
    { date: new Date(2018, 9, 1).getTime(), value: 500 },
    { date: new Date(2018, 9, 16).getTime(), value: 150 },
    { date: new Date(2018, 12, 1).getTime(), value: 800 },
    { date: new Date(2018, 12, 2).getTime(), value: 30 },
    { date: new Date(2018, 12, 5).getTime(), value: 100 }
];

/*tl cinsinden verileri içeren statik dizi */
const tlData = [
    { date: new Date(2018, 9, 1).getTime(), value: 10 },
    { date: new Date(2018, 9, 16).getTime(), value: 1000 },
    { date: new Date(2018, 9, 17).getTime(), value: 300 },
    { date: new Date(2018, 10, 1).getTime(), value: 280 },
    { date: new Date(2018, 10, 2).getTime(), value: 3000 },
    { date: new Date(2018, 10, 5).getTime(), value: 280 },
    { date: new Date(2018, 11, 1).getTime(), value: 0 },
    { date: new Date(2018, 11, 16).getTime(), value: 50 },
    { date: new Date(2018, 11, 17).getTime(), value: 500 },
    { date: new Date(2018, 12, 1).getTime(), value: 2200 },
    { date: new Date(2018, 12, 2).getTime(), value: 300 },
    { date: new Date(2018, 12, 5).getTime(), value: 1000 }
];

/*tüm walletların componentWillMount'da içine atılacağı dizi tanımlanıyor */
let totalBalances = [];
let scrollSectionsData = [];
class Chart extends Component {
    constructor() {
        super();
        /*tüm animasyonları ve grafik üzerindeki cursor'un konumu
         belirleyen scrollY animated value'su tanımlanıyor */
        this.scrollYAnimatedValue = new Animated.Value(0);
    }

    /*componentWillMount, componentler yüklenmeden önce bir kez çalışır*/
    componentWillMount() {
        scrollSectionsData = [];
        euroData.forEach(wdata => {
            scrollSectionsData.push(
                { title: wdata.date, price: "€" + wdata.value, data: ['item', 'item'] }
            )
        });
        this.props.walletScrollDataChanged(scrollSectionsData);
        /*tüm datalar bir dizi içerisine atılıyor */
        totalBalances.push(euroData)
        totalBalances.push(dolarData)
        totalBalances.push(tlData)

        /* totalBalances dizisi convertRates fonksiyonuna parametre olarak veriliyor.
        methodun içeriği graphAction'da açıklanmıştır*/
        this.props.convertRates(totalBalances);

        /*onBalanceChange methoduna 0 parametresi gönderilerek çağırılıyor.
        bu işlem ilk para biriminin yani totalBalances dizisinin ilk index'indeki wallet'ın, 
        collapsible headerda görünmesini sağlıyor */
        this.onBalanceChange(0);
    }
    /*bu method wallet değiştiğinde çalışır */
    onBalanceChange(page) {
        /*moneyIcon değişkeni scroll içerisindeki title'da görülen toplam girdi çıktının para birimini 
        göstermek için tanımlanıyor. page parametresi datanın sırasını belirtir. bu senaryoda statik olarak 
        oluşturulan datalardan sıfırıncısı euro, birincisi dolar, ikincisi türk lirası cinsindendir.
        switch case ile page parametresi kontrol ediliyor ve title'daki girdi-çıktı miktarının başına
        konulacak para birimi simgesi moneyIcon değişkeni içerisine atılıyor.*/
        let moneyIcon = '';
        switch (page) {
            case 1:
                moneyIcon = '$'
                break;
            case 2:
                moneyIcon = '₺'
                break;
            default:
                //0 ise
                moneyIcon = '€'
                break;
        }

        /*wallet değiştirildiğinde totalBalances dizisinin page'inci indexi içerisindeki wallet datası 
        forEach ile dönülüyor ve scroll içerisinde görünmesi için veriler scrollSectionsData dizisine yazılıyor.*/
        scrollSectionsData = [];
        totalBalances[page].forEach(wdata => {
            scrollSectionsData.push(
                { title: wdata.date, price: moneyIcon + wdata.value, data: ['item', 'item'] }
            )
        });
        this.props.walletScrollDataChanged(scrollSectionsData);


        /*action'daki balanceChanged methodunu çağırır.
    methodun içeriği graphAction'da açıklanmıştır. */
        this.props.balanceChanged(totalBalances[page])
    }

    render() {

        /*tüm animasyonlar scroll'a bağlı olarak çalışır ve açıklamaları tek tek yapılmıştır. */

        /*dairesel butonların yukarı doğru kayarak kaybolması için gerekli olan animasyon */
        const headerHeight = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [HEADER_MAX_HEIGHT - 200, HEADER_MIN_HEIGHT],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        /*dairesel butonların opacity'sini azaltarak sıfıra indiren animasyon */
        const buttonOpacity = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [1.0, 0],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        /*wallet'ın yazıldığı collapsible'ın içerisindeki fontSize'ı küçütüp büyüten animasyon  */
        const textSize = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [30, 18],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        /*wallet'ın üzerindeki total balance yazısının fontSize'ını küçütüp büyüten animasyon  */
        const subTextSize = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [18, 0],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        /*grafiğin tavana olan marginini azaltıp yükselten animasyon */
        const chartTop = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [height * 0.26, height * 0.1],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        /* reklam banner'ının tavana olan marginini azaltıp yükselten animasyon */
        const collapsibleMenuTop = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [height * 0.5, height * 0.3],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        /*reklam banner'ının opacity'sini azaltarak kaybolmasını sağlayan animasyon */
        const collapsibleMenuOpacity = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, 220],
            outputRange: [1, 0],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        /* addFunds butonunun genişliğini azaltıp çoğaltan animasyon */
        const addFundsButtonWidth = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [120, 30],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        /* addFunds butonunun tavana olan marginini azaltıp yükselten animasyon */
        const addFundsButtonMarginTop = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [height * 0.02, 0],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        /* addFunds butonunun fontSize'ını küçütüp büyüten animasyon */
        const addFundsButtonFontSize = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [16, 0],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        /* fastPayment butonunun tavana olan marginini azaltıp yükselten animasyon */
        const fastPaymentButtonTop = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MAX_HEIGHT * 0.95)],
            outputRange: [height * 0.65, height * 0.93],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        /* fastPayment butonunun sol tarafa olan marginini azaltıp çoğaltan animasyon */
        const fastPaymentButtonLeft = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MAX_HEIGHT * 0.90)],
            outputRange: [width * 0.2, width * 0.8],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        /* fastPayment butonunun genişliğini azaltıp çoğaltan animasyon */
        const fastPaymentButtonWidth = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MAX_HEIGHT * 0.90)],
            outputRange: [width * 0.6, width * 0.1],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        /* fastPayment butonunun fontSize'ını küçütüp büyüten animasyon */
        const fastPaymentButtonFontSize = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MAX_HEIGHT * 0.90)],
            outputRange: [22, 0],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const sectionList =
            (<SectionList
                /*renderItem data objesinin içeriğinin listelendiği methoddur. index kaçıncı eleman olduğunu,
                item ise data objesi içerisinde bulunan veriyi tutar. burada item içerisinde metin vardır 
                ve react-native'in text componenti içerisine yazılmıştır. */
                renderItem={({ item, index, section }) =>
                    <View style={styles.sectionContainer}>
                        <Text key={index}>{item}</Text>
                    </View>
                }
                /*section'ın başlığı yani o tarihteki toplam girdi-çıktının ve tarih bilgisinin bulunduğu
                kısım. section başlığı iki yana yaslı iki adet text componentinden oluşur
                textlerin içeri aşağıdaki gibidir. title: tarih bilgisini, price: o tarihteki toplam
                girdi-çıktıyı ekrana yazar */
                renderSectionHeader={({ section: { title, price } }) => (
                    <View style={styles.sectionTitle}>
                        <Text style={{ color: '#888', fontSize: 15 }}>{new Date(title).getDate()+' '+month[new Date(title).getMonth()]}</Text>
                        <Text style={{ color: '#888', fontSize: 15 }}>{price}</Text>
                    </View>

                )}
                /*title tarih bilgisi, price o tarihteki girdi-çıktının toplamı
                data objesi ise o tarihteki her bir işlemi ayrı ayrı bir eleman olarak alır
                verilerin göründüğü view ve textlerin tasarımı yukarıdarı ve açıklaması yazılmıştır.*/
                sections={this.props.scrollData.reverse()}
                keyExtractor={(item, index) => item + index}
            />);

        /*balance değiştiğinde action'dan verinin dönmesi sırasında donma yaşanmaması için, spinner
        yerleştirdim normal şartlarda spinner görünmeyecek kadar hızlı veri akışı oluyor. fakat düşük
        performanslı telefonlar için donma önlemi gibi düşünebilirsiniz.
        hiç ihtiyaç da olmayabilir fakat yine de bu küçük kod bloğunu ekledim. */
        const balanceCarousel = this.props.balances == null ? <ActivityIndicator /> :
            (<Carousel
                width={width * 0.4}
                height={100}
                hideIndicators={true}
                animate={false}
                onPageChange={this.onBalanceChange.bind(this)}
            >
                <View>
                    <Animated.Text style={{ fontSize: subTextSize, color: '#aaa' }}>Total balance</Animated.Text>
                    <Animated.Text style={[styles.headerText, { fontSize: textSize }]}>{this.props.balances[0]}</Animated.Text>
                </View>
                <View>
                    <Animated.Text style={{ fontSize: subTextSize, color: '#aaa' }}>Total balance</Animated.Text>
                    <Animated.Text style={[styles.headerText, { fontSize: textSize }]}>{this.props.balances[1]}</Animated.Text>
                </View>
                <View>
                    <Animated.Text style={{ fontSize: subTextSize, color: '#aaa' }}>Total balance</Animated.Text>
                    <Animated.Text style={[styles.headerText, { fontSize: textSize }]}>{this.props.balances[2]}</Animated.Text>
                </View>
            </Carousel>);
        return (
            <View style={styles.container}>

                {/*tüm animasyonların bağlı olduğu scrollable kısım. içerisinde dataya göre listenecek
                tarih ve o tarihteki girdi çıktıyı listeler. buradaki veriler statiktir.
                chart'ı oluşturan datanın burada parse edilmesi gerekir. 
                ilgili sectionList verisi render methodu içerisinde oluşturuluyor*/}
                <Animated.ScrollView
                    contentContainerStyle={{ paddingTop: height * 0.70 }}
                    scrollEventThrottle={16}
                    onScroll={
                        Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.scrollYAnimatedValue } } }],
                            { onScroll: this.props.yPointChanged(this.scrollYAnimatedValue) }
                        )                        
                    }>
                    {sectionList}
                </Animated.ScrollView>

                {/*hesaptaki toplam veriyi para birimi bazında alıp gösteren collapsible başlığı ve
                çizilen tasarımda bulunan add funds butonunu içeren kısımdır. scroll ile birlikte küçülüp büyüyebilir. */}
                <Animated.View style={[styles.animatedHeader]}>
                    <View>
                        {balanceCarousel}
                    </View>
                    <Animated.View style={{ marginTop: addFundsButtonMarginTop }}>
                        <TouchableOpacity
                            onPress={() => { console.log('1'); }}
                            style={styles.addFundsButton}>
                            <Animated.View style={{ flexDirection: 'row', justifyContent: 'center', width: addFundsButtonWidth }}>
                                <Icon name={"plus"} size={20} color="#fff" />
                                <Animated.Text style={{ color: '#fff', fontSize: addFundsButtonFontSize }}>Add funds</Animated.Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>

                {/*tasarımdaki dairesel butonların bulunduğu kısımdır.
                scroll ile kaybolabilir. */}
                <Animated.View style={[styles.buttonWrapper, { opacity: buttonOpacity, top: (Platform.OS == 'ios') ? 20 + headerHeight : headerHeight }]}>
                    <TouchableOpacity
                        onPress={() => { console.log('1'); }}
                        style={styles.buttons}>
                        <Icon name={"plus"} size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { console.log('2'); }}
                        style={styles.buttons}>
                        <Icon name={"exchange-alt"} size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { console.log('3'); }}
                        style={styles.buttons}>
                        <Icon name={"info-circle"} size={20} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>

                {/*reklam banner'ı kısmıdır. collapsible'dir ve statik olarak 3 view eklenmiştir.
            örnek teşkil edilmesi bakımından view'ların içeriği üçünde de farklıdır.
            burası da scroll ile kaybolabilir */}
                <Animated.View style={[styles.collapsibleMenuStyle, { top: collapsibleMenuTop, opacity: collapsibleMenuOpacity }]}>
                    <Carousel
                        width={width * 0.9}
                        height={height * 0.12}
                        delay={5000}
                        indicatorAtBottom={true}
                        indicatorSize={0}
                    >
                        <View style={[styles.contentContainer, { flexDirection: 'row' }]}>
                            <View style={{ flex: 2, alignItems: 'center' }}>
                                <Image
                                    source={{ uri: 'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png' }}
                                    style={{ width: 50, height: 50, borderRadius: 100 }}
                                />
                            </View>
                            <View style={{ flex: 6, alignItems: 'flex-start' }}>
                                <Text style={{ color: '#222', fontSize: 20 }}>Apple pay is here</Text>
                                <Text style={{ color: '#555', fontSize: 15 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</Text>
                            </View>
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={{ color: '#000' }}>Android pay is here</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <Image
                                source={{ uri: 'https://vibestechs.com/images/vibeLogoTR.png' }}
                                style={{ width: 250, height: 50, borderRadius: 5 }}
                            />
                        </View>
                    </Carousel>
                </Animated.View>

                {/*data ile oluşan grafiği içerir. scroll ile yukarı kayabilir.*/}
                <Animated.View style={[styles.graph, { top: chartTop }]}>
                    <Graph />
                </Animated.View>

                {/*tasarımda bulunan fast payment butonunu içeren kısımdır.
                scroll ile hızlıca aşağıya taşınır ve boyutu küçülerek sadece ikonlu,
                dairesel bir butona dönüşür*/}
                <Animated.View style={[styles.fastPaymentButtonArea, { top: fastPaymentButtonTop, left: fastPaymentButtonLeft }]}>
                    <TouchableOpacity
                        onPress={() => { console.log('fast payment'); }}
                        style={styles.fastPaymentButton}>
                        <Animated.View style={{ flexDirection: 'row', justifyContent: 'center', width: fastPaymentButtonWidth }}>
                            <View style={{ alignItems: 'center', margin: 5, marginBottom: 0 }}>
                                <Icon name={"bolt"} size={20} color="#fff" />
                            </View>
                            <View>
                                <Animated.Text style={{ color: '#fff', fontSize: fastPaymentButtonFontSize }}>Fast Payments</Animated.Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                </Animated.View>

            </View>
        );
    }
}

{/*componentlerin style kısmıdır. yorum satırlarını react-native bilmediğinizi 
    varsayarak yazdığım için bu kısmı css gibi olduğunu söyleyebilirim */}
const styles = StyleSheet.create({
    container: {
        paddingTop: (Platform.OS == 'ios') ? 20 : 0
    },
    graph: {
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedHeader: {
        flex: 1,
        position: 'absolute',
        padding: 50,
        paddingBottom: 0,
        top: (Platform.OS == 'ios') ? 20 : 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        height: height * 0.3
    },
    headerText: {
        color: 'black',
    },
    item: {
        backgroundColor: '#E0E0E0',
        margin: 8,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemText: {
        color: 'black',
        fontSize: 16
    },
    buttonWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    buttons: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        backgroundColor: '#0078ff',
        borderRadius: 50
    },
    collapsibleMenuStyle: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#fff',
        marginBottom: height * 0.008,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3,
        width: width * 0.9
    },
    addFundsButton: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0078ff',
        borderRadius: 15,
        height: 30
    },
    contentContainer: {
        borderWidth: 2,
        borderColor: '#eee',
        backgroundColor: '#f4f4f4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(100, 100, 100, 0.12)',
        backgroundColor: '#efefef',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    sectionTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        height: 40
    },
    fastPaymentButtonArea: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fastPaymentButton: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0078ff',
        borderRadius: 35,
        height: width * 0.1
    },
});

{/*redux yapısı
yPoint scroll bilgisini graph.tsx dosyasına çekebilmek için kullanılan state değişkenidir. 
 yPoint scroll hareket ettirildiğinde çalışan yPointChanged methodu ile güncellenir.
 bu method graphActions.js içerisindedir.

balances, değişen para biriminin içeriğini almak ve grafiği güncellemek için kullanılan state değişkenidir
 balances collapsible change olduğunda çalışan balanceChanged methodu ile güncellenir.
 bu method graphActions.js içerisindedir

fonksiyonların açıklamaları yukarıda yapılmıştır.*/}
const mapStateToProps = state => {
    const { yPoint, balances, scrollData } = state.graph;
    return {
        yPoint,
        balances,
        scrollData
    };
};


export default connect(mapStateToProps,
    {
        yPointChanged,
        convertRates,
        balanceChanged,
        walletScrollDataChanged
    })(Chart);