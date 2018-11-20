import Url from './Url';
import RouteExpression from './RouteExpression';

describe('Url', () => {

    it('should test route', () => {
        const schemeName = 'example:';
        const routeExpression = new RouteExpression('/colors/:color');
        const textColor = 'red';
        const color = 'green';
        const urlObj = Url.create(
            `${schemeName}//colors/${color}?textColor=${textColor}`,
        );

        const result = urlObj.testRoute(routeExpression);

        expect(result).toEqual({
            scheme: schemeName,
            route: routeExpression.routeExpression,
            query: {
                textColor
            },
            params: {
                color
            }
        });
    });

});
