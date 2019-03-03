import React, { Component } from 'react';
import { Linking, View, Text } from 'react-native';
import renderer from 'react-test-renderer';
import withDeepLinking from '../src/withDeepLinking';

jest.mock('Linking', () => {
    const getInitialURLMock = jest.fn();
    const addEventListenerMock = jest.fn();
    const removeEventListenerMock = jest.fn();
    const canOpenUrl = jest.fn();
    
    return {
        canOpenURL: jest.fn(),
        getInitialURL: getInitialURLMock,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
        mockClear: () => {
            canOpenUrl.mockClear();
            getInitialURLMock.mockClear();
            addEventListenerMock.mockClear();
            removeEventListenerMock.mockClear();
        }
    };
});

const url = 'example://colors/green';

const customComponentDisplayName = 'CustomComponent';
const customComponentStaticPropertyValue = 'value';
class CustomComponent extends Component {
    static staticProperty = customComponentStaticPropertyValue;

    static displayName = customComponentDisplayName;

    render() {
        return (
            <View>
                <Text>Text</Text>
            </View>
        );
    }
}

describe('withDeepLinking', () => {
    beforeEach(() => {
        Linking.mockClear();
    });

    it('should call onGetInitialUrlError callback when getInitialURL throws an error', done => {
        const onGetInitialUrlError = err => {
            expect(err).toBeInstanceOf(Error);

            done();
        };
        const ComponentWithDeepLinking = withDeepLinking()(CustomComponent);

        Linking.getInitialURL.mockReturnValueOnce(Promise.reject(new Error()));

        renderer.create(<ComponentWithDeepLinking onGetInitialUrlError={onGetInitialUrlError} />);
    });

    it('should call onCanOpenUrlError callback when canOpenUrl throws an error', done => {
        const onCanOpenUrlError = err => {
            expect(err).toBeInstanceOf(Error);

            done();
        };
        const EnhancedComponent = withDeepLinking()(CustomComponent);

        Linking.canOpenURL.mockReturnValueOnce(Promise.reject(new Error()));
        Linking.getInitialURL.mockReturnValueOnce(Promise.resolve(url));

        renderer.create(<EnhancedComponent onCanOpenUrlError={onCanOpenUrlError} />);
    });

    it('should call onUrlIsNotSupported callback when a url is not supported', done => {
        const onUrlIsNotSupported = arg => {
            expect(arg).toBe(url);

            done();
        };
        const EnhancedComponent = withDeepLinking()(CustomComponent);

        Linking.canOpenURL.mockReturnValueOnce(Promise.resolve(false));
        Linking.getInitialURL.mockReturnValueOnce(Promise.resolve(url));

        renderer.create(<EnhancedComponent onUrlIsNotSupported={onUrlIsNotSupported} />);
    });

    it('should call onCannotHandleUrl callback when cannot find callback for the url', done => {
        const deepLinkingHandlerMock = {
            getUrlCallback: () => null
        };
        const onCannotHandleUrl = arg => {
            expect(arg).toBe(url);

            done();
        };
        const EnhancedComponent = withDeepLinking(deepLinkingHandlerMock)(CustomComponent);


        Linking.canOpenURL.mockReturnValueOnce(Promise.resolve(true));
        Linking.getInitialURL.mockReturnValueOnce(Promise.resolve(url));

        renderer.create(<EnhancedComponent onCannotHandleUrl={onCannotHandleUrl} />);
    });

    it('should call getUrlCallback method of deepLinkingHandler', done => {
        const deepLinkingHandlerMock = {
            getUrlCallback: arg => {
                expect(arg).toBe(url);

                done();
            }
        };
        const EnhancedComponent = withDeepLinking(deepLinkingHandlerMock)(CustomComponent);

        Linking.canOpenURL.mockReturnValueOnce(Promise.resolve(true));
        Linking.getInitialURL.mockReturnValueOnce(Promise.resolve(url));

        renderer.create(<EnhancedComponent />);
    });

    it('should call the url callback and pass component props to the function', done => {
        const componentProps = { a: 1 };
        const urlCallbackMock = props => {
            expect(props).toStrictEqual(componentProps);

            done();
        };
        const deepLinkingHandlerMock = {
            getUrlCallback: () => urlCallbackMock
        };
        const EnhancedComponent = withDeepLinking(deepLinkingHandlerMock)(CustomComponent);

        Linking.canOpenURL.mockReturnValueOnce(Promise.resolve(true));
        Linking.getInitialURL.mockReturnValueOnce(Promise.resolve(url));

        renderer.create(<EnhancedComponent {...componentProps} />);
    });

    it('should have displayName', () => {
        const EnhancedComponent = withDeepLinking()(CustomComponent);

        expect(EnhancedComponent.displayName).toBe(`WithDeepLinking(${customComponentDisplayName})`);
    });

    it('should have static properties of WrappedComponent', () => {
        const EnhancedComponent = withDeepLinking()(CustomComponent);

        expect(EnhancedComponent.staticProperty).toBe(customComponentStaticPropertyValue);
    });
});
