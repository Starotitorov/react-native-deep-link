import { navigate } from './navigationService';

export const handleColorScreenDeepLink = ({ params: { color }, query: { textColor } }) => () => {
    navigate({
        routeName: 'Color',
        params: {
            color,
            textColor
        }
    });
};
