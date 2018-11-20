const ROUTE_PARAMETER_REGEXP = /:([^/]*)/g;
const ROUTE_PARAMETER_VALUE_STUB = '(.*)';

export default class RouteExpression {
    constructor(routeExpression) {
        this.routeExpression = routeExpression;
        this.parameters = this.getParameters();
        this.routeRegexp = this.getRouteRegexp();
    }

    getParameters() {
        return this.routeExpression.match(ROUTE_PARAMETER_REGEXP) || [];
    }

    getRouteRegexp() {
        const routeRegexpStr = this.parameters.reduce(
            (acc, parameter) => acc.replace(parameter, ROUTE_PARAMETER_VALUE_STUB),
            this.routeExpression
        );

        return new RegExp(routeRegexpStr, 'g');
    }

    getParametersValues(matches) {
        return this.parameters.reduce((acc, parameter, index) => {
            const parameterName = parameter.substr(1);

            acc[parameterName] = decodeURIComponent(matches[index + 1]);

            return acc;
        }, {});
    }

    testPath(path) {
        const matches = this.routeRegexp.exec(path);

        if (!matches || matches[0] !== matches.input ||
            (matches.length > 1 && matches[1].includes('/'))) {
            return null;
        }

        return this.getParametersValues(matches);
    }
}
