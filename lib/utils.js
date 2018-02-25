export const deepClone = source => {
    const destination = Array.isArray(source) ? [] : {};

    Object.keys(source).forEach(k => {
        const v = source[k];

        destination[k] = (typeof v === 'object') ? deepClone(v) : v;
    });

    return destination;
};
