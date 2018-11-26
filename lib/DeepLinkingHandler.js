import Route from 'route-parser';
import Url from './Url';
import { isString, isArray, isFunction } from './utils';

export default class DeepLinkingHandler {
    constructor(schemes = []) {
        this.schemes = {};

        this.registerSchemes(schemes);
    }

    findScheme(schemeName) {
        return this.schemes[schemeName];
    }

    registerSchemes(schemes) {
        if (!isArray(schemes)) {
            throw new Error('The method accepts an array of schemes.');
        }

        schemes.forEach(scheme => this.registerScheme(scheme));
    }

    registerScheme({ name: schemeName, routes }) {
        if (!isString(schemeName) || !isArray(routes)) {
            throw new Error('The argument is not a valid scheme.');
        }

        if (this.findScheme(schemeName)) {
            throw new Error(
                `The scheme ${schemeName} has already been registered.`
            );
        }

        this.schemes[schemeName] = {
            name: schemeName,
            routes: []
        };

        routes.forEach(route => this.registerRoute(schemeName, route));
    }

    registerRoute(schemeName, { expression, callback }) {
        if (!isString(expression) || !isFunction(callback)) {
            throw new Error('The argument is not a valid route.');
        }

        const scheme = this.findScheme(schemeName);

        if (!scheme) {
            throw new Error(`The scheme ${schemeName} was not registered.`);
        }

        const routeObject = new Route(expression);

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
