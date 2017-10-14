import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class ColorScreen extends Component {
    static navigationOptions = ({ navigation: { state: { params: { color } } } }) => {
        return {
            title: color
        }
    };

    render() {
        const { navigation: { state: { params: { color } } } } = this.props;

        return (
            <View style={[styles.container, {backgroundColor: color}]}>
                <Text style={styles.text}>
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
