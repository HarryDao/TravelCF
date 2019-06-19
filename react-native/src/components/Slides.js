import React from 'react';
import { View, ScrollView, Text, Dimensions, Image, LayoutAnimation, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { AppLoading } from 'expo';
import { COLORS } from '../styles';
import { images } from '../media';
import { SCREEN_LOADING_TIME } from '../../configs/app';
const SCREEN_WIDTH = Dimensions.get('window').width;

class Slides extends React.Component {
    state = { hide: true, enableAnimation: true }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ hide: false });
        }, SCREEN_LOADING_TIME/2)
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.enableAnimation) {
            LayoutAnimation.easeInEaseOut();
        }
    }

    onPress = () => {
        this.setState({ enableAnimation: false }, () => {
            this.props.onSlideComplete();
        })
    }

    renderLastSlide(index) {
        if (index === this.props.data.length - 1) {
            return (
                <Button
                    title='Start Now!'
                    raised
                    backgroundColor={COLORS.aqua_darker}
                    color={COLORS.white}
                    buttonStyle={{ marginTop: 20 }}
                    onPress={this.onPress}
                    fontWeight='600'
                />
            );
        }
    }

    renderDots(targetIndex) {
        const {
            dotStyle,
            dotFilledStyle,
        } = styles;

        return this.props.data.map((slide, index) => {
            return (
                <View
                    key={`dot-${targetIndex}-${index}`}
                    style={[dotStyle, index === targetIndex ? dotFilledStyle : {}]}
                />
            );
        });
    }

    renderSlides() {
        const {
            slideStyle,
            textStyle,
            dotContainerStyle,
            iconWrapperStyle,
            iconStyle,
        } = styles;

        return this.props.data.map((slide, index) => {
            return (
                <View
                    key={`slide-${index}`}
                    style={[slideStyle, { backgroundColor: slide.color }]}
                >
                    {/* <View style={iconWrapperStyle}>
                        <Image
                            source={images.travelcf}
                            style={iconStyle}
                        />
                    </View> */}

                    <Text style={textStyle}>{slide.text}</Text>
                    {this.renderLastSlide(index)}
                    
                    <View style={dotContainerStyle}>
                        {this.renderDots(index)}
                    </View>
                </View>
            );
        });
    }

    renderContent() {
        if (this.state.hide) {
            return <AppLoading/>;
        }

        return this.renderSlides();
    }

    render() {
        return (
            <ScrollView
                horizontal
                pagingEnabled
                style={{ backgroundColor: COLORS.black_light }}
            >
                {this.renderContent()}
            </ScrollView>
        );
    }
}

const styles = {
    loadingContainer: {
        flex: 1,
        backgroundColor: COLORS.black_light,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
    },
    slideStyle: {
        flex: 1,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10,
        paddingLeft: 10,
        position: 'relative',
    },
    textStyle: {
        fontSize: 30,
        color: COLORS.white,
        textAlign: 'center'
    },
    dotContainerStyle: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    dotStyle: {
        borderRadius: 10,
        borderColor: COLORS.white,
        height: 15,
        width: 15,
        borderWidth: 2,
        marginLeft: 5,
        marginRight: 5,
    },
    dotFilledStyle: {
        backgroundColor: COLORS.white,
    },
    iconWrapperStyle: {
        position: 'absolute',
        top: 50,
    },
    iconStyle: {
        height: 50, 
        width: 50
    }
}

export default Slides;