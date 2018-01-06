import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DEFAULT_BACKGROUND_COLOR = 'white';
const DEFAULT_TEXT_COLOR = 'black';

export default class ColorScreen extends Component {
    static navigationOptions = ({ navigation: { state: { params: { color } } } }) => {
        return {
            title: color
        }
    };

    render() {
        const { navigation: { state: { params: { color, textColor } } } } = this.props;

        return (
            <View style={[styles.container, { backgroundColor: color || DEFAULT_BACKGROUND_COLOR }]}>
                <Text style={[styles.text, { color: textColor || DEFAULT_TEXT_COLOR }]}>
                    {color.toUpperCase()}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 54
    }
});
