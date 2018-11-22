import React, { Component } from 'react';
import { Linking } from 'react-native';
import { isFunction } from './utils';

const withDeepLinking = deepLinkingHandler => WrappedComponent => class extends Component {
    componentDidMount() {
        Linking.getInitialURL().then(url => this.handleURL(url));

        Linking.addEventListener('url', this.handleURLReceive);
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleURLReceive);
    }

    handleURLReceive = event => {
        this.handleURL(event.url);
    };

    handleURL = url => {
        if (!url) {
            return;
        }

        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    return;
                }

                const callback = deepLinkingHandler.getUrlCallback(url);

                if (isFunction(callback)) {
                    callback(this.props);
                }
            });
    };

    render() {
        return (
            <WrappedComponent {...this.props} />
        );
    }
};

export default withDeepLinking;
