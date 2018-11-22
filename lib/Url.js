import urlParse from 'url-parse';
import Route from 'route-parser';

export default class Url {
    static create(url) {
        return new Url(url);
    }

    constructor(url) {
        const urlObj = urlParse(url, true);

        this.scheme = urlObj.protocol;
        this.path = `/${urlObj.host}${urlObj.pathname}`;
        this.query = urlObj.query;
    }

    match(routeExpression) {
        const route = new Route(routeExpression);
        const params = route.match(this.path);

        if (!params) {
            return null;
        }

        return {
            scheme: this.scheme,
            route: routeExpression,
            query: this.query,
            params
        };
    }
}
