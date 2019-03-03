import DeepLinkingHandler from './DeepLinkingHandler';
import withDeepLinking from './withDeepLinking';

export default function createDeepLinkingHandler(schemes) {
    const deepLinkingHandler = DeepLinkingHandler.create(schemes);

    return withDeepLinking(deepLinkingHandler);
}
