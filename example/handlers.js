import { NavigationActions } from 'react-navigation';

export const handleColorScreenDeepLink = ({ params: { color }, query: { textColor }}) => ({ dispatch }) => {
    dispatch(NavigationActions.navigate({
        routeName: 'Color',
        params: {
            color,
            textColor
        }
    }));
};
