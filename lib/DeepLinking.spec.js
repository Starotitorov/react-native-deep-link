import * as DeepLinking from './DeepLinking';

const URL = 'example://colors/%23f00?textColor=%230f0';

describe('DeepLinking', () => {
    let mockCallback;

    beforeEach(() => {
        mockCallback = jest.fn();

        DeepLinking.registerSchemes([
            {
                name: 'example:',
                routes: [
                    {
                        name: '/colors/:color',
                        callback: () => mockCallback
                    }
                ]
            }
        ]);
    });

    afterEach(() => DeepLinking.unregisterSchemes());

    it ('should get callback for url', () => {
        const callback = DeepLinking.getUrlCallback(URL);

        callback();

        expect(mockCallback.mock.calls.length).toBe(1);

        expect(mockCallback.mock.calls[0][0]).toEqual({
            scheme: 'example:',
            route: '/colors/:color',
            query: {
                textColor: '#0f0'
            },
            params: {
                color: '#f00'
            }
        })
    });
});
