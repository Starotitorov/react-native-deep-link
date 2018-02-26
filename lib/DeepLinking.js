import urlParse from 'url-parse';
import { deepClone } from './utils';

const ROUTE_PARAMETER_REGEXP = /:([^/]*)/g;
const ROUTE_PARAMETER_VALUE_STUB = '(.*)';
const SLASH = '/';

const schemes = [];

const findScheme = schemeName => schemes.find(({ name }) => name === schemeName);

const findSchemeIndex = schemeName => schemes.findIndex(({ name }) => name === schemeName);

const addScheme = (name, routes) => schemes.push({ name, routes });

const removeScheme = index => schemes.splice(index, 1);

const findRouteIndex = (scheme, routeName) =>
    scheme.routes.findIndex(({ name }) => name === routeName);

const addRouteToScheme = (scheme, routeName, callback) =>
    scheme.routes.push({ name: routeName, callback });

const removeRouteFromScheme = (scheme, routeName) => {
    scheme.routes = scheme.routes.filter(({ name }) => name !== routeName);
};

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

    if (!matches || matches[0] !== matches.input || (matches.length > 1 && matches[1].includes(SLASH))) {
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

const getUrlCallback = urlString => {
    if (!urlString) {
        return;
    }

    const url = urlParse(urlString, true);

    const scheme = findScheme(url.protocol);

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

const registerScheme = (schemeName, routes) =>
    routes.forEach(({ name, callback }) => registerRoute(schemeName, name, callback));

const unregisterScheme = schemeName => {
    const index = findSchemeIndex(schemeName);

    if (index !== -1) {
        removeScheme(index);
    }
};

const registerSchemes = schemesConfig =>
    schemesConfig.forEach(({ name, routes }) => registerScheme(name, routes));

const unregisterSchemes = () => schemes.splice(0, schemes.length);

const registerRoute = (schemeName, routeName, callback) => {
    const scheme = findScheme(schemeName);
    if (!scheme) {
        return addScheme(schemeName, [{ name: routeName, callback }]);
    }

    if (findRouteIndex(scheme, routeName) === -1) {
        addRouteToScheme(scheme, routeName, callback);
    }
};

const unregisterRoute = (schemeName, routeName) => {
    const scheme = findScheme(schemeName);

    if (scheme) {
        removeRouteFromScheme(scheme, routeName);
    }
};

const DeepLinking = {
    registerRoute,
    unregisterRoute,
    registerSchemes,
    unregisterSchemes,
    registerScheme,
    unregisterScheme,
    getUrlCallback,
    get schemes() {
        return deepClone(schemes);
    }
};

export default DeepLinking;
