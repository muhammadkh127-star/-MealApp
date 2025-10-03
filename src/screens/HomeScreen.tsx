import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  Surface,
  ProgressBar,
  Chip,
  FAB,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  MealPlan: undefined;
  GroceryList: undefined;
  Recipes: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const {width} = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [weeklyProgress, setWeeklyProgress] = useState(0.6);
  const [todaysMeals, setTodaysMeals] = useState([
    {
      id: '1',
      name: 'Avocado Toast',
      type: 'breakfast',
      calories: 320,
      time: '8:00 AM',
    },
    {
      id: '2',
      name: 'Quinoa Salad',
      type: 'lunch',
      calories: 450,
      time: '1:00 PM',
    },
    {
      id: '3',
      name: 'Grilled Salmon',
      type: 'dinner',
      calories: 520,
      time: '7:00 PM',
    },
  ]);

  const [quickStats, setQuickStats] = useState({
    mealsPlanned: 12,
    groceriesNeeded: 8,
    caloriesToday: 1290,
    budgetUsed: 45.50,
  });

  const handleCreateMealPlan = () => {
    navigation.navigate('MealPlan');
  };

  const handleViewGroceryList = () => {
    navigation.navigate('GroceryList');
  };

  const handleViewRecipes = () => {
    navigation.navigate('Recipes');
  };

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '#FFB74D';
      case 'lunch':
        return '#4CAF50';
      case 'dinner':
        return '#2196F3';
      case 'snack':
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Title style={styles.welcomeTitle}>Good morning! 👋</Title>
          <Paragraph style={styles.welcomeSubtitle}>
            Ready to plan your healthy meals for today?
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Weekly Progress */}
      <Card style={styles.progressCard}>
        <Card.Content>
          <View style={styles.progressHeader}>
            <Title>Weekly Progress</Title>
            <Text style={styles.progressText}>4 of 7 days planned</Text>
          </View>
          <ProgressBar
            progress={weeklyProgress}
            color="#4CAF50"
            style={styles.progressBar}
          />
        </Card.Content>
      </Card>

      {/* Today's Meals */}
      <Card style={styles.mealsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Today's Meals</Title>
          {todaysMeals.map((meal) => (
            <Surface key={meal.id} style={styles.mealItem}>
              <View style={styles.mealInfo}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Chip
                    mode="outlined"
                    style={[
                      styles.mealTypeChip,
                      {backgroundColor: getMealTypeColor(meal.type)},
                    ]}
                    textStyle={styles.mealTypeText}>
                    {meal.type}
                  </Chip>
                </View>
                <View style={styles.mealDetails}>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                  <Text style={styles.mealCalories}>{meal.calories} cal</Text>
                </View>
              </View>
            </Surface>
          ))}
        </Card.Content>
      </Card>

      {/* Quick Stats */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Stats</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="restaurant-menu" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{quickStats.mealsPlanned}</Text>
              <Text style={styles.statLabel}>Meals Planned</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="shopping-cart" size={24} color="#FF9800" />
              <Text style={styles.statValue}>{quickStats.groceriesNeeded}</Text>
              <Text style={styles.statLabel}>Items Needed</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="local-fire-department" size={24} color="#F44336" />
              <Text style={styles.statValue}>{quickStats.caloriesToday}</Text>
              <Text style={styles.statLabel}>Calories Today</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="attach-money" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>${quickStats.budgetUsed}</Text>
              <Text style={styles.statLabel}>Budget Used</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={handleCreateMealPlan}
              style={styles.actionButton}
              icon="restaurant-menu">
              Plan Meals
            </Button>
            <Button
              mode="outlined"
              onPress={handleViewGroceryList}
              style={styles.actionButton}
              icon="shopping-cart">
              View Groceries
            </Button>
            <Button
              mode="outlined"
              onPress={handleViewRecipes}
              style={styles.actionButton}
              icon="book">
              Browse Recipes
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* FAB for quick meal planning */}
      <FAB
        style={styles.fab}
        icon="add"
        onPress={handleCreateMealPlan}
        label="Plan Meals"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  welcomeCard: {
    margin: 16,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  progressCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  mealsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2E7D32',
  },
  mealItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  mealInfo: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  mealTypeChip: {
    height: 24,
  },
  mealTypeText: {
    fontSize: 12,
    color: '#fff',
  },
  mealDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealTime: {
    fontSize: 14,
    color: '#666',
  },
  mealCalories: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: (width - 64) / 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
});

export default HomeScreen;
