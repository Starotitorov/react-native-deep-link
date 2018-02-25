import { NavigationActions } from 'react-navigation';

export const handleColorScreenDeepLink = ({ dispatch }) => ({ params: { color }, query: { textColor } }) => {
    dispatch(NavigationActions.navigate({
        routeName: 'Color',
        params: {
            color,
            textColor
        }
    }));
};
