import React, { Component } from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { Linking } from 'react-native';
import { shallow, configure } from 'enzyme';
import withDeepLinking from './withDeepLinking';

configure({ adapter: new Adapter() });

jest.mock('react-native');

const url = 'example://colors/green';

const customComponentDisplayName = 'CustomComponent';
const customComponentStaticPropertyValue = 'value';
class CustomComponent extends Component {
    static staticProperty = customComponentStaticPropertyValue;

    static displayName = customComponentDisplayName;

    render() {
        return null;
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
        const ComponentWithDeepLinking = withDeepLinking()(Component);

        Linking.getInitialURL.mockReturnValueOnce(Promise.reject(new Error()));

        shallow(<ComponentWithDeepLinking onGetInitialUrlError={onGetInitialUrlError} />);
    });

    it('should call onCanOpenUrlError callback when app canOpenUrl throws an error', done => {
        const onCanOpenUrlError = err => {
            expect(err).toBeInstanceOf(Error);

            done();
        };
        const EnhancedComponent = withDeepLinking()(Component);

        Linking.canOpenURL.mockReturnValueOnce(Promise.reject(new Error()));
        Linking.getInitialURL.mockReturnValueOnce(Promise.resolve(url));

        shallow(<EnhancedComponent onCanOpenUrlError={onCanOpenUrlError} />);
    });

    it('should call onUrlIsNotSupported callback when utl is not supported', done => {
        const onUrlIsNotSupported = arg => {
            expect(arg).toBe(url);

            done();
        };
        const EnhancedComponent = withDeepLinking()(Component);

        Linking.canOpenURL.mockReturnValueOnce(Promise.resolve(false));
        Linking.getInitialURL.mockReturnValueOnce(Promise.resolve(url));

        shallow(<EnhancedComponent onUrlIsNotSupported={onUrlIsNotSupported} />);
    });

    it('should call onCannotHandleUrl callback when can not find callback for the url', done => {
        const deepLinkingHandlerMock = {
            getUrlCallback: () => null
        };
        const onCannotHandleUrl = arg => {
            expect(arg).toBe(url);

            done();
        };
        const EnhancedComponent = withDeepLinking(deepLinkingHandlerMock)(Component);


        Linking.canOpenURL.mockReturnValueOnce(Promise.resolve(true));
        Linking.getInitialURL.mockReturnValueOnce(Promise.resolve(url));

        shallow(<EnhancedComponent onCannotHandleUrl={onCannotHandleUrl} />);
    });

    it('should call url callback and pass url as an argument', done => {
        const deepLinkingHandlerMock = {
            getUrlCallback: arg => {
                expect(arg).toBe(url);

                done();
            }
        };
        const EnhancedComponent = withDeepLinking(deepLinkingHandlerMock)(Component);

        Linking.canOpenURL.mockReturnValueOnce(Promise.resolve(true));
        Linking.getInitialURL.mockReturnValueOnce(Promise.resolve(url));

        shallow(<EnhancedComponent />);
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
