import { createDeepLinkingHandler } from 'react-native-deep-link';
import { handleColorScreenDeepLink } from './handlers'

export default createDeepLinkingHandler([{
    name: 'example:',
    routes: [{
        expression: '/colors/:color',
        callback: handleColorScreenDeepLink
    }]
}]);
