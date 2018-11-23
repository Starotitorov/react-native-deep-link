import Route from 'route-parser';
import Url from './Url';

export default class DeepLinkingHandler {
    constructor(schemes = []) {
        this.schemes = {};

        this.registerSchemes(schemes);
    }

    registerSchemes(schemes) {
        schemes.forEach(scheme => this.registerScheme(scheme));
    }

    registerScheme({ name: schemeName, routes }) {
        if (this.schemes[schemeName]) {
            throw new Error(
                `The scheme ${schemeName} has already been registered.`
            );
        }

        routes.forEach(route => this.registerRoute(schemeName, route));
    }

    registerRoute(schemeName, { name, callback }) {
        const scheme = this.findScheme(schemeName);
        const routeObject = new Route(name);

        if (!scheme) {
            this.schemes[schemeName] = {
                name: schemeName,
                routes: [{ name, callback, object: routeObject }]
            };
            return;
        }

        scheme.routes.push({ name, callback, object: routeObject });
    }

    findScheme(schemeName) {
        return this.schemes[schemeName];
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

        return (...args) => urlCallbacks.forEach(callback => callback(...args));
    }
}
