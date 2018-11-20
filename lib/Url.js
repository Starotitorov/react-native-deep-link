import urlParse from 'url-parse';

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

    testRoute(routeExpression) {
        const params = routeExpression.testPath(this.path);

        if (!params) {
            return null;
        }

        return {
            scheme: this.scheme,
            route: routeExpression.routeExpression,
            query: this.query,
            params
        };
    }
}
