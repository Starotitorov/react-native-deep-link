import DeepLinking from './DeepLinking';
import withDeepLinking from './withDeepLinking';

export default function createDeepLinkingHandler(schemes) {
    DeepLinking.registerSchemes(schemes);

    return withDeepLinking;
}
