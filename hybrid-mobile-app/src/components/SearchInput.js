import React from 'react';
import { View, Text, ListView, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '../styles';
import { Button } from './common';
import Modal from './Modal';
import ButtonClose from './ButtonClose';
const SCREEN_WIDTH = Dimensions.get('window').width;


class SearchInput extends React.Component {
    state = { showModal: false }

    componentWillMount() {
        this.generateDataSource(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.generateDataSource(nextProps);

        const { keyProp, activeInput } = nextProps;
        this.setState({ showModal: activeInput === keyProp });
    }

    generateDataSource = (props) => {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });

        this.dataSource = ds.cloneWithRows(props.options);
    }

    onAirportClick = (code) => {
        const {
            keyProp,
            select
        } = this.props;
        
        return select(keyProp, code);
    }

    renderMainButton() {
        const {
            keyProp,
            placeholder,
            icon,
            iconType,
            value,
            onActiveInputChange,
        } = this.props;

        const {
            buttonStyle,
            buttonTextStyle,
            iconStyle,
            buttonActiveTextStyle
        } = styles;

        if (value) {
            return (
                <Button
                    style={buttonStyle}
                    onPress={() => onActiveInputChange(keyProp)}
                >
                    <Text style={buttonActiveTextStyle}>{value}</Text>
                </Button>
            );
        }

        return (
            <Button 
                style={buttonStyle}
                onPress={() => onActiveInputChange(keyProp)}
            >
                <Icon 
                    type={iconType} 
                    name={icon}
                    iconStyle={iconStyle}
                /> 
                <Text style={buttonTextStyle}>{placeholder}</Text>
            </Button>
        );
    }

    render() {
        const {
            label,
            renderRow,
            onActiveInputChange
        } = this.props;     

        const {
            containerStyle,
            labelStyle,
            listViewContainerStyle
        } = styles;

        return (
            <View style={containerStyle}>
                <Text style={labelStyle}>{label}:</Text>
                
                {this.renderMainButton()}

                <Modal
                    visible={this.state.showModal}
                >
                    <ButtonClose
                        onPress={() => onActiveInputChange('')}
                    />
                    <ListView
                        enableEmptySections
                        dataSource={this.dataSource}
                        renderRow={renderRow}
                        style={listViewContainerStyle}
                    />
                </Modal>
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        marginTop: 15,
        marginBottom: 15, 
        paddingLeft: 10,
        paddingRight: 10,
    },
    labelStyle: {
        color: COLORS.grey_light,
        fontSize: 20,
        lineHeight: 25,
        fontWeight: '400',
    },
    buttonStyle: {
        justifyContent: 'center',
    },
    iconStyle: {
        fontSize: 20,
        color: COLORS.aqua,
        marginRight: 10,
    },
    buttonTextStyle: {
        color: COLORS.white,
        fontSize: 20,
        lineHeight: 25,
    },
    buttonActiveTextStyle: {
        color: COLORS.aqua,
        fontSize: 20,
        lineHeight: 25
    },
    listViewContainerStyle: {
        paddingRight: 15,
        paddingLeft: 15,
        width: SCREEN_WIDTH
    }
}

export default SearchInput;