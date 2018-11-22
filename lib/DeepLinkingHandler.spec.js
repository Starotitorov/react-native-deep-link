import DeepLinkingHandler from './DeepLinkingHandler';

const schemeName = 'example:';

describe('DeepLinkingHandler', () => {

    describe('registering schemes', () => {

        const routes = [
            {
                name: '/colors',
                callback: () => () => {}
            },
            {
                name: '/colors/:colorName',
                callback: () => () => {}
            }
        ];

        it('should register schemes', () => {
            const schemes = [{
                name: schemeName,
                routes
            }];
            const deepLinkingHandler = new DeepLinkingHandler();
            deepLinkingHandler.registerSchemes(schemes);

            expect(deepLinkingHandler.schemes).toEqual({
                [schemeName]: {
                    name: schemeName,
                    routes
                }
            });
        });

        it('should throw an error when the scheme has already been registered', () => {
            const schemes = [{
                name: schemeName,
                routes
            }];
            const deepLinkingHandler = new DeepLinkingHandler();
            deepLinkingHandler.registerSchemes(schemes);

            expect(() => {
                deepLinkingHandler.registerScheme({ name: schemeName, route: [] });
            }).toThrow();
        })

    });

    describe('url handling', () => {

        const resourceId = 'aeaf15';
        const subResourceId = '1d0449';
        const parameter = 'value';
        const url = `${schemeName}//resource/${resourceId}/subResource/${subResourceId}` +
            `?parameter=${parameter}`;

        it('should return null when urlString was not passed', () => {
            const deepLinkingHandler = new DeepLinkingHandler();
            const callback = deepLinkingHandler.getUrlCallback();

            expect(callback).toBeNull();
        });

        it('should return null when scheme was not registered', () => {
            const schemes = [{
                name: 'other:',
                routes: [{
                    name: '/other/route',
                    callback: () => () => {}
                }]
            }];
            const deepLinkingHandler = new DeepLinkingHandler(schemes);
            const callback = deepLinkingHandler.getUrlCallback(url);

            expect(callback).toBeNull();
        });

        it('should return url callback', () => {
            const otherCallback = jest.fn(() => () => {});
            const firstNeededCallback = jest.fn(() => () => {});
            const secondNeededCallback = jest.fn(() => () => {});

            const routes = [
                {
                    name: '/resource/:resourceId/subResource/',
                    callback: otherCallback
                },
                {
                    name: '/resource/:resourceId/subResource/:subResourceId',
                    callback: firstNeededCallback
                },
                {
                    name: '/resource/*rest',
                    callback: secondNeededCallback
                }
            ];

            const deepLinkingHandler = new DeepLinkingHandler([{
                name: schemeName,
                routes: routes
            }]);

            const callback = deepLinkingHandler.getUrlCallback(url);

            callback();

            expect(otherCallback).not.toBeCalled();

            expect(firstNeededCallback).toBeCalled();

            expect(firstNeededCallback.mock.calls[0][0]).toEqual({
                scheme: schemeName,
                route: routes[1].name,
                query: {
                    parameter
                },
                params: {
                    resourceId,
                    subResourceId
                }
            });

            expect(secondNeededCallback).toBeCalled();

            expect(secondNeededCallback.mock.calls[0][0]).toEqual({
                scheme: schemeName,
                route: routes[2].name,
                query: {
                    parameter
                },
                params: {
                    rest: `${resourceId}/subResource/${subResourceId}`
                }
            });
        });
    });
});
