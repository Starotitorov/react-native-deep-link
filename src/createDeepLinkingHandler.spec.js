import { Component } from 'react';
import createDeepLinkingHandler from './createDeepLinkingHandler';

describe('createDeepLinkingHandler', () => {
    it('should return higher order component', () => {
        const withDeepLinkingHandler = createDeepLinkingHandler([]);
        const DeepLinkingHandlerComponent = withDeepLinkingHandler(Component);

        expect(withDeepLinkingHandler).toBeInstanceOf(Function);
        expect(DeepLinkingHandlerComponent).toBeInstanceOf(Function);
    });
});
