export const isArray = Array.isArray;

export const isString = value => typeof value === 'string' || value instanceof String;

export const isFunction = value => typeof value === 'function';

export const getDisplayName = WrappedComponent =>
    WrappedComponent.displayName || WrappedComponent.name || 'Component';
