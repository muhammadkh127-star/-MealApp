import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  Surface,
  Chip,
  FAB,
  Modal,
  Portal,
  TextInput,
  SegmentedButtons,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  dayOfWeek: number;
  calories: number;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
}

const MealPlanScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Avocado Toast with Poached Egg',
      type: 'breakfast',
      dayOfWeek: 1,
      calories: 420,
      prepTime: 15,
      difficulty: 'easy',
    },
    {
      id: '2',
      name: 'Quinoa Buddha Bowl',
      type: 'lunch',
      dayOfWeek: 1,
      calories: 520,
      prepTime: 25,
      difficulty: 'medium',
    },
    {
      id: '3',
      name: 'Grilled Salmon with Roasted Vegetables',
      type: 'dinner',
      dayOfWeek: 1,
      calories: 480,
      prepTime: 35,
      difficulty: 'medium',
    },
    {
      id: '4',
      name: 'Greek Yogurt Parfait',
      type: 'snack',
      dayOfWeek: 1,
      calories: 180,
      prepTime: 5,
      difficulty: 'easy',
    },
  ]);

  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const dietaryOptions = [
    'Vegan',
    'Vegetarian',
    'Keto',
    'Gluten-Free',
    'Dairy-Free',
    'Low-Carb',
    'High-Protein',
  ];

  const getMealsForDay = (dayIndex: number) => {
    return meals.filter(meal => meal.dayOfWeek === dayIndex);
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const handleMealPress = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowMealModal(true);
  };

  const handleGenerateMealPlan = () => {
    // TODO: Implement AI meal plan generation
    console.log('Generating meal plan...');
  };

  const handleAddMeal = () => {
    // TODO: Navigate to recipe selection
    console.log('Adding new meal...');
  };

  const renderMealItem = ({item}: {item: Meal}) => (
    <Surface
      style={styles.mealItem}
      onTouchEnd={() => handleMealPress(item)}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Chip
          mode="outlined"
          style={[
            styles.mealTypeChip,
            {backgroundColor: getMealTypeColor(item.type)},
          ]}
          textStyle={styles.mealTypeText}>
          {item.type}
        </Chip>
      </View>
      <View style={styles.mealDetails}>
        <View style={styles.mealInfo}>
          <Icon name="local-fire-department" size={16} color="#F44336" />
          <Text style={styles.mealInfoText}>{item.calories} cal</Text>
        </View>
        <View style={styles.mealInfo}>
          <Icon name="access-time" size={16} color="#666" />
          <Text style={styles.mealInfoText}>{item.prepTime} min</Text>
        </View>
        <Chip
          mode="outlined"
          style={[
            styles.difficultyChip,
            {backgroundColor: getDifficultyColor(item.difficulty)},
          ]}
          textStyle={styles.difficultyText}>
          {item.difficulty}
        </Chip>
      </View>
    </Surface>
  );

  const renderDayColumn = (dayIndex: number) => {
    const dayMeals = getMealsForDay(dayIndex);
    
    return (
      <View key={dayIndex} style={styles.dayColumn}>
        <Text style={styles.dayTitle}>{weekDays[dayIndex]}</Text>
        <FlatList
          data={dayMeals}
          renderItem={renderMealItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Surface style={styles.emptyMealSlot}>
              <Icon name="add" size={24} color="#ccc" />
              <Text style={styles.emptyMealText}>Add meal</Text>
            </Surface>
          }
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with filters and actions */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Title style={styles.headerTitle}>Weekly Meal Plan</Title>
            <Button
              mode="outlined"
              onPress={() => setShowFilters(!showFilters)}
              icon="filter-list">
              Filters
            </Button>
          </View>
          
          {showFilters && (
            <View style={styles.filtersContainer}>
              <Text style={styles.filterLabel}>Dietary Preferences:</Text>
              <View style={styles.chipContainer}>
                {dietaryOptions.map(option => (
                  <Chip
                    key={option}
                    selected={dietaryFilters.includes(option)}
                    onPress={() => {
                      if (dietaryFilters.includes(option)) {
                        setDietaryFilters(prev => 
                          prev.filter(filter => filter !== option)
                        );
                      } else {
                        setDietaryFilters(prev => [...prev, option]);
                      }
                    }}
                    style={styles.filterChip}>
                    {option}
                  </Chip>
                ))}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Week selector */}
      <Card style={styles.weekSelectorCard}>
        <Card.Content>
          <SegmentedButtons
            value={selectedWeek.toString()}
            onValueChange={(value) => setSelectedWeek(parseInt(value))}
            buttons={[
              {value: '0', label: 'This Week'},
              {value: '1', label: 'Next Week'},
              {value: '2', label: 'Week 3'},
            ]}
          />
        </Card.Content>
      </Card>

      {/* Meal plan grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.weekGrid}>
          {weekDays.map((_, dayIndex) => renderDayColumn(dayIndex))}
        </View>
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={handleGenerateMealPlan}
          style={styles.actionButton}
          icon="auto-awesome">
          Generate Plan
        </Button>
        <Button
          mode="outlined"
          onPress={handleAddMeal}
          style={styles.actionButton}
          icon="add">
          Add Meal
        </Button>
      </View>

      {/* Meal details modal */}
      <Portal>
        <Modal
          visible={showMealModal}
          onDismiss={() => setShowMealModal(false)}
          contentContainerStyle={styles.modalContainer}>
          {selectedMeal && (
            <Card style={styles.modalCard}>
              <Card.Content>
                <Title>{selectedMeal.name}</Title>
                <View style={styles.modalDetails}>
                  <View style={styles.modalInfo}>
                    <Icon name="local-fire-department" size={20} color="#F44336" />
                    <Text>{selectedMeal.calories} calories</Text>
                  </View>
                  <View style={styles.modalInfo}>
                    <Icon name="access-time" size={20} color="#666" />
                    <Text>{selectedMeal.prepTime} minutes</Text>
                  </View>
                  <View style={styles.modalInfo}>
                    <Icon name="star" size={20} color="#FF9800" />
                    <Text>{selectedMeal.difficulty}</Text>
                  </View>
                </View>
                <View style={styles.modalActions}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowMealModal(false)}
                    style={styles.modalButton}>
                    Close
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => {
                      // TODO: Navigate to recipe details
                      setShowMealModal(false);
                    }}
                    style={styles.modalButton}>
                    View Recipe
                  </Button>
                </View>
              </Card.Content>
            </Card>
          )}
        </Modal>
      </Portal>

      <FAB
        style={styles.fab}
        icon="add"
        onPress={handleAddMeal}
        label="Add Meal"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerCard: {
    margin: 16,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  filtersContainer: {
    marginTop: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  weekSelectorCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
  },
  weekGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  dayColumn: {
    width: width * 0.4,
    marginRight: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#2E7D32',
  },
  mealItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  mealTypeChip: {
    height: 20,
  },
  mealTypeText: {
    fontSize: 10,
    color: '#fff',
  },
  mealDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealInfoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  difficultyChip: {
    height: 20,
  },
  difficultyText: {
    fontSize: 10,
    color: '#fff',
  },
  emptyMealSlot: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  emptyMealText: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  modalContainer: {
    padding: 20,
  },
  modalCard: {
    elevation: 8,
  },
  modalDetails: {
    marginVertical: 16,
    gap: 8,
  },
  modalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
});

export default MealPlanScreen;
