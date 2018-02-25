import * as DeepLinking from './DeepLinking';

describe('DeepLinking', () => {

    describe('register schemes', () => {

        it('should register schemes', () => {
            const schemes = [{
                name: 'example:',
                routes: [{
                    name: '/colors/:color',
                    callback: () => () => {
                    }
                }]
            }];
            DeepLinking.registerSchemes(schemes);

            expect(DeepLinking.schemes).toEqual(schemes);
        });

        it('should unregister schemes', () => {
            const schemes = [{
                name: 'scheme:',
                routes: [{
                    name: '/route',
                    callback: () => () => {
                    }
                }]
            }];
            DeepLinking.registerSchemes(schemes);

            DeepLinking.unregisterSchemes();

            expect(DeepLinking.schemes).toEqual([]);
        });
    });

    describe('schemes manipulations', () => {

        afterEach(() => DeepLinking.unregisterSchemes());

        it('should register scheme', () => {
            const schemeName = 'scheme:';
            const routes = [{
                name: '/route',
                callback: () => () => {}
            }];

            DeepLinking.registerScheme(schemeName, routes);

            expect(DeepLinking.schemes).toContainEqual({
                name: schemeName,
                routes
            });
        });

        it('should unregister scheme by name', () => {
            const schemeName = 'scheme:';
            const scheme = {
                name: schemeName,
                routes: [{
                    name: '/route',
                    callback: () => () => {
                    }
                }]
            };
            const otherScheme = {
                name: 'otherScheme:',
                routes: [{
                    name: '/otherRoute',
                    callback: () => () => {
                    }
                }]
            };

            DeepLinking.registerSchemes([otherScheme, scheme]);

            DeepLinking.unregisterScheme(schemeName);

            expect(DeepLinking.schemes).toContainEqual(otherScheme);
            expect(DeepLinking.schemes).not.toContainEqual(scheme)
        });
    });

    describe('routes manipulations', () => {

        afterEach(() => DeepLinking.unregisterSchemes());

        it('should register route', () => {
            const schemeName = 'scheme:';
            const routeName = '/route';
            const callback = () => () => {
            };

            DeepLinking.registerRoute(schemeName, routeName, callback);

            expect(DeepLinking.schemes).toContainEqual({
                name: schemeName,
                routes: [{
                    name: routeName,
                    callback
                }]
            });
        });

        it('should register route when there are other routes', () => {
            const schemeName = 'scheme:';
            const routeName = '/route';
            const otherRouteName = '/otherRoute';
            const callback = () => () => {};

            DeepLinking.registerSchemes([{
                name: schemeName,
                routes: [{
                    name: otherRouteName,
                    callback
                }]
            }]);

            DeepLinking.registerRoute(schemeName, routeName, callback);

            const { routes } = DeepLinking.schemes.find(({ name }) => name === schemeName);

            expect(routes).toContainEqual({ name: otherRouteName, callback });
            expect(routes).toContainEqual({ name: routeName, callback });
        });

        it('should unregister route', () => {
            const schemeName = 'scheme:';
            const routeName = '/route';
            const callback = () => () => {};

            DeepLinking.registerRoute(schemeName, routeName, callback);

            DeepLinking.unregisterRoute(schemeName, routeName);

            const { routes } = DeepLinking.schemes.find(({ name }) => name === schemeName);

            expect(routes).not.toContainEqual({ name: routeName, callback });
            expect(DeepLinking.schemes).toContainEqual({ name: schemeName, routes: [] });
        })
    });

    describe('url handling', () => {

        const URL = 'example://colors/green?textColor=red';

        afterEach(() => DeepLinking.unregisterSchemes());

        it('should return undefined when route was not found', () => {
            const callback = DeepLinking.getUrlCallback(URL);

            expect(callback).toBeUndefined();
        });

        it('should handle url', () => {
            const mockCallback = jest.fn();

            DeepLinking.registerSchemes([{
                name: 'example:',
                routes: [{
                    name: '/colors/:color',
                    callback: () => mockCallback
                }]
            }]);

            const callback = DeepLinking.getUrlCallback(URL);

            callback();

            expect(mockCallback.mock.calls.length).toBe(1);

            expect(mockCallback.mock.calls[0][0]).toEqual({
                scheme: 'example:',
                route: '/colors/:color',
                query: {
                    textColor: 'red'
                },
                params: {
                    color: 'green'
                }
            });
        });
    });
});
