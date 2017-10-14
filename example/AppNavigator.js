import { StackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen';
import ColorScreen from './ColorScreen';

const AppNavigator = StackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            title: 'Home'
        }
    },
    Color: {
        screen: ColorScreen
    }
});

export const AppRouter = AppNavigator.router;
export default AppNavigator;
