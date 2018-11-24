import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DEFAULT_BACKGROUND_COLOR = 'white';
const DEFAULT_TEXT_COLOR = 'black';

export default class ColorScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('color', DEFAULT_BACKGROUND_COLOR)
        }
    };

    render() {
        const { navigation } = this.props;
        const color = navigation.getParam('color', DEFAULT_BACKGROUND_COLOR);
        const textColor = navigation.getParam('textColor', DEFAULT_TEXT_COLOR);

        return (
            <View style={[styles.container, { backgroundColor: color }]}>
                <Text style={[styles.text, { color: textColor }]}>
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
