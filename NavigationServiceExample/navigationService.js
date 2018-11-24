import { NavigationActions } from 'react-navigation';

let navigator;

export const setTopLevelNavigator = navigatorRef => {
    navigator = navigatorRef;
};

export const navigate = ({ routeName, params }) => {
    navigator.dispatch(
        NavigationActions.navigate({ routeName, params })
    );
};
