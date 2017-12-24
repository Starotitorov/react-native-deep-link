import * as DeepLinking from './DeepLinking';

const URL = 'example://conversations/1/messages/2?parameter=value';

describe('DeepLinking', () => {
    let mockCallback;

    beforeEach(() => {
        mockCallback = jest.fn();

        DeepLinking.registerSchemes([
            {
                name: 'example:',
                routes: [
                    {
                        name: '/conversations/:conversationId/messages/:messageId',
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
            route: '/conversations/:conversationId/messages/:messageId',
            query: {
                parameter: 'value'
            },
            params: {
                conversationId: '1',
                messageId: '2'
            }
        })
    });
});
