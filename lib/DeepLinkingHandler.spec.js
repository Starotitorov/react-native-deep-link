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

        const textColor = 'red';
        const color = 'green';
        const url = `${schemeName}//colors/${color}?textColor=${textColor}`;

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
            const colorsCallback = jest.fn(() => () => {});
            const exactColorCallback = jest.fn(() => () => {});

            const routes = [
                {
                    name: '/colors/',
                    callback: colorsCallback
                },
                {
                    name: '/colors/:color',
                    callback: exactColorCallback
                }
            ];

            const deepLinkingHandler = new DeepLinkingHandler([{
                name: schemeName,
                routes: routes
            }]);

            const callback = deepLinkingHandler.getUrlCallback(url);

            callback();

            expect(colorsCallback).not.toBeCalled();

            expect(exactColorCallback).toBeCalled();

            expect(exactColorCallback.mock.calls[0][0]).toEqual({
                scheme: schemeName,
                route: routes[1].name,
                query: {
                    textColor
                },
                params: {
                    color
                }
            });
        });
    });
});
