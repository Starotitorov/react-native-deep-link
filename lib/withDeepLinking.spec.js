import React, { Component } from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { Linking } from 'react-native';
import { shallow, configure } from 'enzyme';
import withDeepLinking from './withDeepLinking';

configure({ adapter: new Adapter() });

jest.mock('react-native');

describe('withDeepLinking', () => {

    beforeEach(() => {
        Linking.mockClear();
    });

    it('should call url callback and pass url as an argument', done => {
        const url = 'example://colors/green';
        const deepLinkingHandlerMock = {
            getUrlCallback: arg => {
                expect(arg).toBe(url);

                done();
            }
        };
        Linking.getInitialURL.mockReturnValueOnce(Promise.resolve(url));
        const ComponentWithDeepLinking = withDeepLinking(deepLinkingHandlerMock)(Component);

        shallow(<ComponentWithDeepLinking />);
    });

});
