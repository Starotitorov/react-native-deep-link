import Route from 'route-parser';
import Url from './Url';

const schemeName = 'example:';
const routeName = '/colors/:color';
const routeObject = new Route(routeName);
const textColor = 'red';
const color = 'green';
const route = { name: routeName, object: routeObject }

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
            route: routeName,
            query: {
                textColor
            },
            params: {
                color
            }
        });
    });

});
