import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { isFunction } from './utils';

const withDeepLinking = deepLinkingHandler => WrappedComponent => class extends Component {
    static propTypes = {
        onGetInitialUrlError: PropTypes.func,
        onCanOpenUrlError: PropTypes.func,
        onUrlIsNotSupported: PropTypes.func,
        onCannotHandleUrl: PropTypes.func
    };

    static defaultProps = {
        onGetInitialUrlError: () => {},
        onCanOpenUrlError: () => {},
        onUrlIsNotSupported: () => {},
        onCannotHandleUrl: () => {}
    };

    componentDidMount() {
        const { onGetInitialUrlError } = this.props;

        Linking.getInitialURL()
            .then(url => this.handleURL(url))
            .catch(err => onGetInitialUrlError(err));

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

        const {
            onGetInitialUrlError,
            onCanOpenUrlError,
            onUrlIsNotSupported,
            onCannotHandleUrl,
            ...rest
        } = this.props;

        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    return onUrlIsNotSupported(url);
                }

                const callback = deepLinkingHandler.getUrlCallback(url);

                if (!isFunction(callback)) {
                    return onCannotHandleUrl(url);
                }

                callback(rest);
            })
            .catch(err => onCanOpenUrlError(err));
    };

    render() {
        const {
            onGetInitialUrlError,
            onCanOpenUrlError,
            onUrlIsNotSupported,
            onCannotHandleUrl,
            ...rest
        } = this.props;

        return (
            <WrappedComponent {...rest} />
        );
    }
};

export default withDeepLinking;
