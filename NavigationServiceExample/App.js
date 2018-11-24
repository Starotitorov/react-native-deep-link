import React from 'react';
import { createAppContainer } from 'react-navigation';
import AppNavigator from './AppNavigator';
import withDeepLinking from './withDeepLinking';
import { setTopLevelNavigator } from './navigationService';

const AppContainer = createAppContainer(AppNavigator);

function App() {
    return (
        <AppContainer ref={
            navigatorRef => {
                setTopLevelNavigator(navigatorRef);
            }}
        />
    );
}

export default withDeepLinking(App);
