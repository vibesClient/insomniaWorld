import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator, TouchableOpacity, Dimensions, SectionList } from 'react-native';
import Animated from "react-native-reanimated";
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Carousel from 'react-native-carousel-view';
import Graph from "./Graph";
import { yPointChanged, convertRates, balanceChanged } from '../actions';

const HEADER_MIN_HEIGHT = 100;
const HEADER_MAX_HEIGHT = 350;
const { width, height } = Dimensions.get('window');
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
const dolarData = [
    { date: new Date(2018, 9, 1).getTime(), value: 500 },
    { date: new Date(2018, 9, 16).getTime(), value: 150 },
    { date: new Date(2018, 9, 17).getTime(), value: 350 },
    { date: new Date(2018, 10, 1).getTime(), value: 280 },
    { date: new Date(2018, 10, 2).getTime(), value: 100 },
    { date: new Date(2018, 10, 5).getTime(), value: 10 },
    { date: new Date(2018, 11, 1).getTime(), value: 80 },
    { date: new Date(2018, 11, 16).getTime(), value: 50 },
    { date: new Date(2018, 11, 17).getTime(), value: 500 },
    { date: new Date(2018, 12, 1).getTime(), value: 800 },
    { date: new Date(2018, 12, 2).getTime(), value: 30 },
    { date: new Date(2018, 12, 5).getTime(), value: 100 }
];
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
let totalBalances = [];

class Chart extends Component {
    constructor() {
        super();

        this.scrollYAnimatedValue = new Animated.Value(0);

        this.array = [];
    }

    componentWillMount() {
        totalBalances.push(euroData)
        totalBalances.push(dolarData)
        totalBalances.push(tlData)
        this.props.convertRates(totalBalances);
        this.onBalanceChange(0);
    }

    onBalanceChange(page) {
        this.props.balanceChanged(totalBalances[page])
    }

    render() {

        const headerHeight = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [HEADER_MAX_HEIGHT - 200, HEADER_MIN_HEIGHT],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const textSize = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [30, 18],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const subTextSize = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [18, 0],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const buttonWrapperHeight = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 20)],
            outputRange: [50, 0],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const buttonOpacity = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [1.0, 0],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const chartTop = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [200, 80],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const scrollingMenuTop = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [400, 250],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const scrollingMenuOpacity = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [1, 0],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const addFundsButtonWidth = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [120, 30],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const addFundsButtonMarginTop = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [30, 0],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const addFundsButtonFontSize = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [16, 0],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const fastPaymentButtonTop = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MAX_HEIGHT * 0.95)],
            outputRange: [height * 0.65, height * 0.85],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const fastPaymentButtonLeft = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MAX_HEIGHT * 0.90)],
            outputRange: [width * 0.25, width * 0.8],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const fastPaymentButtonWidth = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MAX_HEIGHT * 0.90)],
            outputRange: [220, 40],
            extrapolate: Animated.Extrapolate.CLAMP
        });
        const fastPaymentButtonFontSize = this.scrollYAnimatedValue.interpolate({
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MAX_HEIGHT * 0.90)],
            outputRange: [22, 0],
            extrapolate: Animated.Extrapolate.CLAMP
        });

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
                <Animated.ScrollView
                    contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT + 170 }}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.scrollYAnimatedValue } } }],
                        { onScroll: this.props.yPointChanged(this.scrollYAnimatedValue) }
                    )}>
                    <SectionList
                        renderItem={({ item, index, section }) => <Text style={styles.sectionContainer} key={index}>{item}</Text>}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.sectionTitle}>{title}</Text>
                        )}
                        sections={[
                            { title: 'Title1', data: ['item1', 'item2'] },
                            { title: 'Title2', data: ['item3', 'item4'] },
                            { title: 'Title3', data: ['item5', 'item6'] },
                            { title: 'Title4', data: ['item5', 'item6'] },
                            { title: 'Title5', data: ['item5', 'item6'] },
                            { title: 'Title6', data: ['item5', 'item6'] },
                            { title: 'Title7', data: ['item5', 'item6'] },
                            { title: 'Title8', data: ['item5', 'item6'] },
                            { title: 'Title9', data: ['item5', 'item6'] },
                            { title: 'Title10', data: ['item5', 'item6'] },
                            { title: 'Title11', data: ['item5', 'item6'] },
                        ]}
                        keyExtractor={(item, index) => item + index}
                    />
                </Animated.ScrollView>

                <Animated.View style={[styles.animatedHeader, { height: headerHeight }]}>
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

                <Animated.View style={[styles.buttonWrapper, { opacity: buttonOpacity, height: buttonWrapperHeight, top: (Platform.OS == 'ios') ? 20 + headerHeight : headerHeight }]}>
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

                <Animated.View style={[styles.graph, { top: chartTop }]}>
                    <Graph />
                </Animated.View>

                <Animated.View style={[styles.scrollingMenuStyle, { top: scrollingMenuTop, opacity: scrollingMenuOpacity }]}>
                    <Carousel
                        width={width * 0.9}
                        height={100}
                        delay={5000}
                        indicatorAtBottom={true}
                        indicatorSize={20}
                    >
                        <View style={styles.contentContainer}>
                            <Text style={{ color: 'white' }}>Apple pay is here</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={{ color: 'white' }}>Android pay is here</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={{ color: 'white' }}>Windows pay is here</Text>
                        </View>
                    </Carousel>
                </Animated.View>

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
        backgroundColor: '#fff',
        height: 200
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
        justifyContent: 'space-around'
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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
    scrollingMenuStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: 20
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
        backgroundColor: '#8a00d4',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.12)',
        backgroundColor: '#efefef',
    },
    sectionTitle: {
        color: 'black',
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 24,
        opacity: 0.8,
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
        height: 40
    },
});

const mapStateToProps = state => {
    const { yPoint, balances } = state.graph;
    return {
        yPoint,
        balances
    };
};


export default connect(mapStateToProps,
    {
        yPointChanged,
        convertRates,
        balanceChanged
    })(Chart);