import Route from 'route-parser';
import Url from './Url';

export default class DeepLinkingHandler {
    constructor(schemes = []) {
        this.schemes = {};

        this.registerSchemes(schemes);
    }

    findScheme(schemeName) {
        return this.schemes[schemeName];
    }

    registerSchemes(schemes) {
        schemes.forEach(scheme => this.registerScheme(scheme));
    }

    registerScheme({ name: schemeName, routes }) {
        if (this.findScheme(schemeName)) {
            throw new Error(
                `The scheme ${schemeName} has already been registered.`
            );
        }

        routes.forEach(route => this.registerRoute(schemeName, route));
    }

    registerRoute(schemeName, { expression, callback }) {
        const scheme = this.findScheme(schemeName);
        const routeObject = new Route(expression);

        if (!scheme) {
            this.schemes[schemeName] = {
                name: schemeName,
                routes: [{ expression, callback, object: routeObject }]
            };
            return;
        }

        scheme.routes.push({ expression, callback, object: routeObject });
    }

    getUrlCallback(urlString) {
        if (!urlString) {
            return null;
        }

        const urlObj = Url.create(urlString);

        const scheme = this.findScheme(urlObj.scheme);

        if (!scheme) {
            return null;
        }

        const urlCallbacks = scheme.routes.reduce((acc, route) => {
            const result = urlObj.match(route);

            return result ? [...acc, route.callback(result)] : acc;
        }, []);

        return urlCallbacks.length > 0
            ? (...args) => urlCallbacks.forEach(callback => callback(...args))
            : null;
    }
}
