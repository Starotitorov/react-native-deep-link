import RouteExpression from './RouteExpression';

describe('RouteExpression', () => {

    it('should test path', () => {
        const routeExpression = new RouteExpression('/colors/:color');
        const color = 'green';
        const path = `/colors/${color}`;

        const result = routeExpression.testPath(path);

        expect(result).toEqual({
            color
        });
    });

});
