import { createStackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen';
import ColorScreen from './ColorScreen';

const AppNavigator = createStackNavigator({
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

export default AppNavigator;
