import urlParse from 'url-parse';

const ROUTE_PARAMETER_REGEXP = /:([^/]*)/g;
const ROUTE_PARAMETER_VALUE_STUB = '(.*)';
const SLASH = '/';

export const schemes = [];

const getParameters = expression =>
    expression.match(ROUTE_PARAMETER_REGEXP) || [];

const getParametersValues = (matches, parameters) =>
    parameters.reduce((acc, parameter, index) => {
        const parameterName = parameter.substr(1);

        acc[parameterName] = decodeURIComponent(matches[index + 1]);

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

    const scheme = schemes.find(({ name }) => name === url.protocol);

    if (!scheme || !Array.isArray(scheme.routes)) {
        return;
    }

    const { routes } = scheme;
    for (let i = 0; i < routes.length; ++i) {
        const result = handleRoute(url, routes[i].name);

        if (result) {
            return (...args) =>
                routes[i].callback(...args)(result);
        }
    }
};

export const registerSchemes = schemesConfig =>
    schemesConfig.forEach(({ name, routes }) => {
        const index = schemes.findIndex(({ name: n }) => n === name);

        if (index !== -1) {
            return;
        }

        schemes.push({ name, routes });
    });

export const unregisterSchemes = () => schemes.splice(0, schemes.length);

export const registerScheme = (schemeName, routes) => {
    const index = schemes.findIndex(({ name }) => name === schemeName);

    if (index !== -1) {
        return;
    }

    schemes.push({ name: schemeName, routes });
};

export const unregisterScheme = schemeName => {
    const index = schemes.findIndex(({ name }) => name === schemeName);

    if (index === -1) {
        return;
    }

    schemes.splice(index, 1);
};

export const registerRoute = (schemeName, routeName, callback) => {
    const scheme = schemes.find(({ name }) => name === schemeName);
    if (!scheme) {
        return schemes.push({ name: schemeName, routes: [{ name: routeName, callback }] });
    }

    if (scheme.routes.findIndex(({ name }) => name === routeName) !== -1) {
        return;
    }

    scheme.routes.push({ name: routeName, callback });
};

export const unregisterRoute = (schemeName, routeName) => {
    const scheme = schemes.find(({ name }) => name === schemeName);
    if (!scheme) {
        return;
    }

    scheme.routes = scheme.routes.filter(({ name }) => name !== routeName);
};
