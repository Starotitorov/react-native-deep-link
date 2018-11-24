import { handleColorScreenDeepLink } from './handlers';

export default [
    {
        name: 'example:',
        routes: [
            {
                expression: '/colors/:color',
                callback: handleColorScreenDeepLink
            }
        ]
    }
]
