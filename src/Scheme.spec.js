import Route from 'route-parser';
import Scheme from './Scheme';

const schemeName = 'example:';
const routes = [
    {
        expression: '/colors',
        callback: () => () => {}
    },
    {
        expression: '/colors/:color',
        callback: () => () => {}
    }
];

describe('Scheme', () => {
    it('should create scheme', () => {
        const scheme = Scheme.create(schemeName, routes);

        expect(scheme.name).toBe(schemeName);
        expect(scheme.routes).toEqual(
            routes.map(({ expression, callback }) => ({
                expression,
                callback,
                object: expect.any(Route)
            }))
        );
    });
});
