import React from 'react';
import { createDeepLinkingHandler } from 'react-native-deep-link';
import { handleColorScreenDeepLink } from './handlers'

export default createDeepLinkingHandler([{
    name: 'example:',
    routes: [{
        name: '/colors/:color',
        callback: handleColorScreenDeepLink
    }]
}]);
