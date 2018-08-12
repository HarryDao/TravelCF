import React from 'react';
import { View, Modal } from 'react-native';

const ModalComponent = ({ children, visible, styles }) => {
    return (
        <Modal
            animationType='slide'
            transparent
            visible={visible}
            onRequestClose={() => {}}
        >   
            <View
                style={[initialStyles.container, styles || {}]}
            >
                {children}
            </View>
        </Modal>
    );  
}

const initialStyles = {
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        paddingTop: 50,
        paddingBottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
}

export default ModalComponent;