import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
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
  Searchbar,
  SegmentedButtons,
  Modal,
  Portal,
  List,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  dietaryTags: string[];
  rating: number;
  calories: number;
  cost: number;
}

const RecipesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      name: 'Avocado Toast with Poached Egg',
      description: 'A healthy and delicious breakfast option with creamy avocado and perfectly poached egg.',
      prepTime: 10,
      cookTime: 5,
      servings: 2,
      difficulty: 'easy',
      cuisine: 'American',
      dietaryTags: ['vegetarian', 'high-protein'],
      rating: 4.5,
      calories: 420,
      cost: 8.50,
    },
    {
      id: '2',
      name: 'Quinoa Buddha Bowl',
      description: 'Nutritious bowl packed with quinoa, roasted vegetables, and tahini dressing.',
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      difficulty: 'medium',
      cuisine: 'Mediterranean',
      dietaryTags: ['vegan', 'gluten-free', 'high-fiber'],
      rating: 4.8,
      calories: 520,
      cost: 12.00,
    },
    {
      id: '3',
      name: 'Grilled Salmon with Roasted Vegetables',
      description: 'Perfectly grilled salmon served with seasonal roasted vegetables.',
      prepTime: 20,
      cookTime: 35,
      servings: 4,
      difficulty: 'medium',
      cuisine: 'American',
      dietaryTags: ['high-protein', 'low-carb', 'gluten-free'],
      rating: 4.7,
      calories: 480,
      cost: 22.00,
    },
    {
      id: '4',
      name: 'Greek Yogurt Parfait',
      description: 'Layered parfait with Greek yogurt, berries, and granola.',
      prepTime: 5,
      cookTime: 0,
      servings: 1,
      difficulty: 'easy',
      cuisine: 'Greek',
      dietaryTags: ['vegetarian', 'high-protein', 'low-fat'],
      rating: 4.3,
      calories: 180,
      cost: 4.99,
    },
    {
      id: '5',
      name: 'Mediterranean Pasta',
      description: 'Whole wheat pasta with tomatoes, olives, and feta cheese.',
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      difficulty: 'easy',
      cuisine: 'Italian',
      dietaryTags: ['vegetarian', 'high-fiber'],
      rating: 4.4,
      calories: 380,
      cost: 15.50,
    },
    {
      id: '6',
      name: 'Chicken Stir Fry',
      description: 'Quick and healthy stir fry with chicken and mixed vegetables.',
      prepTime: 15,
      cookTime: 15,
      servings: 4,
      difficulty: 'easy',
      cuisine: 'Asian',
      dietaryTags: ['high-protein', 'low-carb', 'gluten-free'],
      rating: 4.6,
      calories: 320,
      cost: 18.00,
    },
  ]);

  const filterOptions = [
    {value: 'all', label: 'All'},
    {value: 'breakfast', label: 'Breakfast'},
    {value: 'lunch', label: 'Lunch'},
    {value: 'dinner', label: 'Dinner'},
    {value: 'snack', label: 'Snack'},
  ];

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

  const getCuisineColor = (cuisine: string) => {
    const colors = [
      '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
      '#2196F3', '#03A9F4', '#00BCD4', '#009688',
      '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B',
      '#FFC107', '#FF9800', '#FF5722', '#795548',
    ];
    const index = cuisine.length % colors.length;
    return colors[index];
  };

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  const handleAddToMealPlan = (recipe: Recipe) => {
    // TODO: Add recipe to meal plan
    console.log('Adding recipe to meal plan:', recipe.name);
  };

  const handleAddToFavorites = (recipe: Recipe) => {
    // TODO: Add recipe to favorites
    console.log('Adding recipe to favorites:', recipe.name);
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.dietaryTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedFilter === 'all') return matchesSearch;
    
    // TODO: Implement proper meal type filtering based on recipe data
    return matchesSearch;
  });

  const renderRecipeCard = ({item}: {item: Recipe}) => (
    <Card style={styles.recipeCard} onPress={() => handleRecipePress(item)}>
      <Card.Content>
        <View style={styles.recipeHeader}>
          <View style={styles.recipeInfo}>
            <Title style={styles.recipeName} numberOfLines={2}>
              {item.name}
            </Title>
            <Paragraph style={styles.recipeDescription} numberOfLines={2}>
              {item.description}
            </Paragraph>
          </View>
          <View style={styles.recipeImage}>
            <Icon name="restaurant" size={40} color="#ccc" />
          </View>
        </View>
        
        <View style={styles.recipeTags}>
          <Chip
            mode="outlined"
            style={[
              styles.difficultyChip,
              {borderColor: getDifficultyColor(item.difficulty)}
            ]}
            textStyle={{color: getDifficultyColor(item.difficulty)}}>
            {item.difficulty}
          </Chip>
          <Chip
            mode="outlined"
            style={[
              styles.cuisineChip,
              {borderColor: getCuisineColor(item.cuisine)}
            ]}
            textStyle={{color: getCuisineColor(item.cuisine)}}>
            {item.cuisine}
          </Chip>
          {item.dietaryTags.slice(0, 2).map(tag => (
            <Chip key={tag} mode="outlined" style={styles.dietaryChip}>
              {tag}
            </Chip>
          ))}
        </View>

        <View style={styles.recipeStats}>
          <View style={styles.statItem}>
            <Icon name="access-time" size={16} color="#666" />
            <Text style={styles.statText}>{item.prepTime + item.cookTime} min</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="people" size={16} color="#666" />
            <Text style={styles.statText}>{item.servings} servings</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="star" size={16} color="#FF9800" />
            <Text style={styles.statText}>{item.rating}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="local-fire-department" size={16} color="#F44336" />
            <Text style={styles.statText}>{item.calories} cal</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="attach-money" size={16} color="#4CAF50" />
            <Text style={styles.statText}>${item.cost}</Text>
          </View>
        </View>

        <View style={styles.recipeActions}>
          <Button
            mode="outlined"
            onPress={() => handleAddToFavorites(item)}
            style={styles.actionButton}
            icon="favorite-border">
            Save
          </Button>
          <Button
            mode="contained"
            onPress={() => handleAddToMealPlan(item)}
            style={styles.actionButton}
            icon="add">
            Add to Plan
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <Card style={styles.searchCard}>
        <Card.Content>
          <Searchbar
            placeholder="Search recipes, ingredients, or dietary tags..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
        </Card.Content>
      </Card>

      {/* Filter buttons */}
      <Card style={styles.filterCard}>
        <Card.Content>
          <SegmentedButtons
            value={selectedFilter}
            onValueChange={setSelectedFilter}
            buttons={filterOptions}
          />
        </Card.Content>
      </Card>

      {/* Recipe count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Recipe list */}
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Recipe details modal */}
      <Portal>
        <Modal
          visible={showRecipeModal}
          onDismiss={() => setShowRecipeModal(false)}
          contentContainerStyle={styles.modalContainer}>
          {selectedRecipe && (
            <Card style={styles.modalCard}>
              <Card.Content>
                <Title style={styles.modalTitle}>{selectedRecipe.name}</Title>
                <Paragraph style={styles.modalDescription}>
                  {selectedRecipe.description}
                </Paragraph>
                
                <View style={styles.modalStats}>
                  <View style={styles.modalStatItem}>
                    <Icon name="access-time" size={20} color="#666" />
                    <Text>Prep: {selectedRecipe.prepTime} min</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Icon name="schedule" size={20} color="#666" />
                    <Text>Cook: {selectedRecipe.cookTime} min</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Icon name="people" size={20} color="#666" />
                    <Text>{selectedRecipe.servings} servings</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Icon name="star" size={20} color="#FF9800" />
                    <Text>{selectedRecipe.rating}/5</Text>
                  </View>
                </View>

                <View style={styles.modalTags}>
                  <Text style={styles.modalTagLabel}>Dietary Tags:</Text>
                  <View style={styles.modalTagContainer}>
                    {selectedRecipe.dietaryTags.map(tag => (
                      <Chip key={tag} mode="outlined" style={styles.modalTag}>
                        {tag}
                      </Chip>
                    ))}
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowRecipeModal(false)}
                    style={styles.modalButton}>
                    Close
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => {
                      handleAddToMealPlan(selectedRecipe);
                      setShowRecipeModal(false);
                    }}
                    style={styles.modalButton}>
                    Add to Meal Plan
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
        onPress={() => console.log('Add custom recipe')}
        label="Add Recipe"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchCard: {
    margin: 16,
    elevation: 4,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: 'transparent',
  },
  filterCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
  },
  countContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  countText: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  recipeCard: {
    marginBottom: 16,
    elevation: 4,
  },
  recipeHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  recipeInfo: {
    flex: 1,
    marginRight: 12,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  recipeImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  difficultyChip: {
    height: 24,
  },
  cuisineChip: {
    height: 24,
  },
  dietaryChip: {
    height: 24,
  },
  recipeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  recipeActions: {
    flexDirection: 'row',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  modalStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 16,
  },
  modalStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTags: {
    marginBottom: 16,
  },
  modalTagLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  modalTagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalTag: {
    height: 28,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
});

export default RecipesScreen;
