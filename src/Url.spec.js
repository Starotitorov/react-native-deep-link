import Route from 'route-parser';
import Url from './Url';

const schemeName = 'example:';
const routeExpression = '/colors/:color';
const routeObject = new Route(routeExpression);
const textColor = 'red';
const color = 'green';
const route = { expression: routeExpression, object: routeObject };

describe('Url', () => {
    it('should return null when the url does not match the route', () => {
        const urlObj = Url.create(`${schemeName}//colors`);

        const result = urlObj.match(route);

        expect(result).toBeNull();
    });

    it('should return object when the url matches the route', () => {
        const urlObj = Url.create(
            `${schemeName}//colors/${color}?textColor=${textColor}`
        );

        const result = urlObj.match(route);

        expect(result).toEqual({
            scheme: schemeName,
            route: routeExpression,
            query: {
                textColor
            },
            params: {
                color
            }
        });
    });
});
