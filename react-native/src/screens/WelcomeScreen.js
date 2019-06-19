import React from 'react';
import { View } from 'react-native';
import { AppLoading } from 'expo';
import { getToken, removeToken } from '../services/AsyncStorage';
import { COLORS } from '../styles';
import Slides from '../components/Slides';

const DATA = [
    { text: 'Welcome to TravelCF', color: COLORS.black_light },
    { text: 'Find best flight price for your next trip', color: COLORS.aqua_darker },
    { text: 'Fill your itinerary and go', color: COLORS.black_light },
];


class WelcomeScreen extends React.Component {
    state = { loading: true }

    async componentWillMount() {
        // await removeToken();
        let token = await getToken();

        if (token) {
            setTimeout(() => {
                this.setState({ loading: false }, () => {
                    this.props.navigation.navigate('search');
                });
            }, 1000);
        }
        else {
            this.setState({ loading: false });
        }
    }

    onSlideComplete = () => {
        this.props.navigation.navigate('login');
    }

    renderContent() {
        if (this.state.loading) {
            return <AppLoading size='large' />
        }
        
        return (
            <Slides
                data={DATA}
                onSlideComplete={this.onSlideComplete}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderContent()}
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: COLORS.black_light,
        alignItems: 'center',
        justifyContent: 'center',
    }
}

export default WelcomeScreen;