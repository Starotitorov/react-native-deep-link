import { AppRouter } from './AppNavigator';
import { combineReducers } from 'redux';

const initialState = AppRouter.getStateForAction(AppRouter.getActionForPathAndParams('Home'));

const navReducer = (state = initialState, action) => {
    const nextState = AppRouter.getStateForAction(action, state);

    return nextState || state;
};

export default combineReducers({
    nav: navReducer
});

