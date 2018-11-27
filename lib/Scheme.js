import Route from 'route-parser';
import { isString, isFunction } from './utils';

export default class Scheme {
    static create(name, routes) {
        return new Scheme(name, routes);
    }

    constructor(name, routes) {
        this.name = name;
        this.routes = [];

        routes.forEach(route => this.registerRoute(route));
    }

    registerRoute({ expression, callback }) {
        if (!isString(expression) || !isFunction(callback)) {
            throw new Error('The argument is not a valid route.');
        }

        const routeObject = new Route(expression);

        this.routes.push({ expression, callback, object: routeObject });
    }
}
