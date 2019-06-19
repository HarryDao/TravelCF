import React from 'react';
import { Provider } from 'react-redux';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { store } from './store';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SearchScreen from './screens/SearchScreen';
import RecentScreen from './screens/RecentScreen';
import DepartScreen from './screens/DepartScreen';
import ReturnScreen from './screens/ReturnScreen';


class Main extends React.Component {
    render() {
        const MainNavigator = createBottomTabNavigator({
            welcome: WelcomeScreen,
            login: LoginScreen,
            main: {
                screen: createBottomTabNavigator({
                    input: {
                        screen: createStackNavigator({
                            search: SearchScreen,
                            recent: RecentScreen,
                        }),
                        navigationOptions: {
                            title: 'Search',
                            tabBarIcon: ({ tintColor }) => {
                                return (
                                    <Icon
                                        type='evil-icon'
                                        name='search'
                                        size={20}
                                        color={tintColor}
                                    />
                                );
                            },
                            tabBarOptions: {
                                labelStyle: { fontSize: 13 }
                            }
                        }
                    },
                    result: {
                        screen: createStackNavigator({
                            depart: DepartScreen,
                            return: ReturnScreen
                        }),
                        navigationOptions: {
                            title: 'Flight',
                            tabBarIcon: ({ tintColor }) => {
                                return (
                                    <Icon
                                        name='flight'
                                        size={20}
                                        color={tintColor}
                                    />
                                );
                            },
                            tabBarOptions: {
                                labelStyle: { fontSize: 13 }
                            }
                        }
                    }
                })
            }
        }, {
            navigationOptions: {
                tabBarVisible: false,
            }
        });

        return (
            <Provider store={store}>
                <MainNavigator/>
            </Provider>
        );
    }
}

export default Main;