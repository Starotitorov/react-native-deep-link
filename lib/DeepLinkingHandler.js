import Url from './Url';
import Scheme from './Scheme';
import { isString, isArray, isFunction } from './utils';

export default class DeepLinkingHandler {
    static create(schemes = []) {
        return new DeepLinkingHandler(schemes);
    }

    constructor(schemes = []) {
        this.schemes = {};

        this._registerSchemes(schemes);
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

            if (!result) {
                return acc;
            }

            const urlCallback = route.callback(result);
            if (!isFunction(urlCallback)) {
                throw new Error(`The route ${route.expression} callback is not a higher order function.`);
            }

            return [...acc, urlCallback];
        }, []);

        return urlCallbacks.length > 0
            ? (...args) => urlCallbacks.forEach(callback => callback(...args))
            : null;
    }

    _registerSchemes(schemes) {
        if (!isArray(schemes)) {
            throw new Error('The method accepts an array of schemes.');
        }

        schemes.forEach(scheme => this._registerScheme(scheme));
    }

    _registerScheme({ name: schemeName, routes }) {
        if (!isString(schemeName) || !isArray(routes)) {
            throw new Error('The argument is not a valid scheme.');
        }

        if (this.findScheme(schemeName)) {
            throw new Error(
                `The scheme ${schemeName} has already been registered.`
            );
        }

        this.schemes[schemeName] = Scheme.create(schemeName, routes);
    }
}
