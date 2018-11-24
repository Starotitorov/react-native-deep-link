import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';
import AppNavigator from './AppNavigator';
import withDeepLinking from './withDeepLinking';

function App({ dispatch, nav }) {
    return (
        <AppNavigator navigation={addNavigationHelpers({
            dispatch,
            state: nav
        })}/>
    );
}

const mapStateToProps = (state) => ({
    nav: state.nav
});

export default connect(mapStateToProps)(withDeepLinking(App));

