import DeepLinkingHandler from './DeepLinkingHandler';
import withDeepLinking from './withDeepLinking';

export default function createDeepLinkingHandler(schemes) {
    const deepLinkingHandler = new DeepLinkingHandler(schemes);

    return withDeepLinking(deepLinkingHandler);
}
