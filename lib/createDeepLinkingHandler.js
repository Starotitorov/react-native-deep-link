import React, { Component } from 'react';
import { Linking } from 'react-native';
import * as DeepLinking from './DeepLinking';

function withDeepLinkingHandler(WrappedComponent) {
    return class extends Component {
        componentDidMount() {
            Linking.getInitialURL().then(url => this.handleURL(url));

            Linking.addEventListener('url', this.handleURLReceive);
        }

        componentWillUnmount() {
            Linking.removeEventListener('url', this.handleURLReceive);
        }

        handleURLReceive = (event) => {
            this.handleURL(event.url);
        };

        handleURL = (url) => {
            Linking.canOpenURL(url)
                .then(supported => {
                    if (supported) {
                        const callback = DeepLinking.getUrlCallback(url);

                        if (typeof callback === 'function') {
                            callback(this.props)
                        }
                    }
                })
        };

        render() {
            return (
                <WrappedComponent {...this.props} />
            );
        }
    }
}

export default function createDeepLinkingHandler(schemes) {
    DeepLinking.registerSchemes(schemes);

    return withDeepLinkingHandler;
}
