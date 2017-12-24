import urlParse from 'url-parse';

const ROUTE_PARAMETER_REGEXP = /:([^/]*)/g;
const ROUTE_PARAMETER_VALUE_STUB = '(.*)';
const SLASH = '/';

const schemes = [];

const getParameters = (expression) =>
    expression.match(ROUTE_PARAMETER_REGEXP) || [];

const getParametersValues = (matches, parameters) =>
    parameters.reduce((acc, parameter, index) => {
        const parameterName = parameter.substr(1);

        acc[parameterName] = matches[index + 1];

        return acc;
    }, {});

const getRouteRegexp = (parameters, routeExpression) => {
    const routeRegexpStr = parameters.reduce(
        (acc, parameter) => acc.replace(parameter, ROUTE_PARAMETER_VALUE_STUB),
        routeExpression
    );

    return new RegExp(routeRegexpStr, 'g');
};

const handleRoute = (url, routeExpression) => {
    const path = SLASH + url.host + url.pathname;

    const parameters = getParameters(routeExpression);

    const routeRegexp = getRouteRegexp(parameters, routeExpression);

    const matches = routeRegexp.exec(path);

    if (!matches || (matches.length > 1 && matches[1].includes(SLASH))) {
        return null;
    }

    const { protocol: scheme, query } = url;
    return {
        scheme,
        route: routeExpression,
        query,
        params: getParametersValues(matches, parameters)
    };
};

export const getUrlCallback = urlString => {
    if (!urlString) {
        return;
    }

    const url = urlParse(urlString, true);

    const schemeIndex = schemes.findIndex(({ name }) => name === url.protocol)

    if (schemeIndex === -1 || !Array.isArray(schemes[schemeIndex].routes)) {
        return;
    }

    for (let i = 0; i < schemes[schemeIndex].routes.length; ++i) {
        const result = handleRoute(url, schemes[schemeIndex].routes[i].name);

        if (result) {
            return (...args) =>
                schemes[schemeIndex].routes[i].callback(...args)(result);
        }
    }
};

export const registerSchemes = schemesConfig => {
    schemesConfig.forEach(scheme => {
        schemes.push(scheme)
    });
};

