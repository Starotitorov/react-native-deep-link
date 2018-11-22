import Url from './Url';

const schemeName = 'example:';
const routeExpression = '/colors/:color';
const textColor = 'red';
const color = 'green';

describe('Url', () => {

    it('should return null when the url does not match the route', () => {
        const urlObj = Url.create(`${schemeName}//colors`);

        const result = urlObj.match(routeExpression);

        expect(result).toBeNull();
    });

    it('should return object when the url matches the route', () => {
        const urlObj = Url.create(
            `${schemeName}//colors/${color}?textColor=${textColor}`
        );

        const result = urlObj.match(routeExpression);

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
