import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import HomeScreen from './screens/HomeScreen';
import MealPlanScreen from './screens/MealPlanScreen';
import GroceryListScreen from './screens/GroceryListScreen';
import RecipesScreen from './screens/RecipesScreen';
import ProfileScreen from './screens/ProfileScreen';

// Import theme
import {theme} from './utils/theme';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName: string;

                switch (route.name) {
                  case 'Home':
                    iconName = 'home';
                    break;
                  case 'MealPlan':
                    iconName = 'restaurant-menu';
                    break;
                  case 'GroceryList':
                    iconName = 'shopping-cart';
                    break;
                  case 'Recipes':
                    iconName = 'book';
                    break;
                  case 'Profile':
                    iconName = 'person';
                    break;
                  default:
                    iconName = 'help';
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: 'gray',
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}>
            <Tab.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{title: 'Home'}}
            />
            <Tab.Screen 
              name="MealPlan" 
              component={MealPlanScreen} 
              options={{title: 'Meal Plan'}}
            />
            <Tab.Screen 
              name="GroceryList" 
              component={GroceryListScreen} 
              options={{title: 'Grocery List'}}
            />
            <Tab.Screen 
              name="Recipes" 
              component={RecipesScreen} 
              options={{title: 'Recipes'}}
            />
            <Tab.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{title: 'Profile'}}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
