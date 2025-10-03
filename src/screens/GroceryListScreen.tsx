import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  Surface,
  Checkbox,
  Chip,
  FAB,
  Searchbar,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  isChecked: boolean;
  recipeIds: string[];
  notes?: string;
}

interface GroceryCategory {
  name: string;
  items: GroceryItem[];
  totalItems: number;
  checkedItems: number;
}

const GroceryListScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([
    {
      id: '1',
      name: 'Avocados',
      category: 'Produce',
      quantity: 3,
      unit: 'pieces',
      estimatedCost: 4.50,
      isChecked: false,
      recipeIds: ['1', '2'],
    },
    {
      id: '2',
      name: 'Quinoa',
      category: 'Grains',
      quantity: 1,
      unit: 'bag',
      estimatedCost: 6.99,
      isChecked: true,
      recipeIds: ['2'],
    },
    {
      id: '3',
      name: 'Salmon fillets',
      category: 'Meat & Seafood',
      quantity: 2,
      unit: 'lbs',
      estimatedCost: 18.00,
      isChecked: false,
      recipeIds: ['3'],
    },
    {
      id: '4',
      name: 'Mixed vegetables',
      category: 'Produce',
      quantity: 1,
      unit: 'bag',
      estimatedCost: 3.99,
      isChecked: false,
      recipeIds: ['3'],
    },
    {
      id: '5',
      name: 'Greek yogurt',
      category: 'Dairy',
      quantity: 1,
      unit: 'container',
      estimatedCost: 4.99,
      isChecked: true,
      recipeIds: ['4'],
    },
    {
      id: '6',
      name: 'Whole grain bread',
      category: 'Bakery',
      quantity: 1,
      unit: 'loaf',
      estimatedCost: 3.49,
      isChecked: false,
      recipeIds: ['1'],
    },
  ]);

  const [totalCost, setTotalCost] = useState(0);
  const [checkedItems, setCheckedItems] = useState(0);

  useEffect(() => {
    const total = groceryItems.reduce((sum, item) => sum + item.estimatedCost, 0);
    const checked = groceryItems.filter(item => item.isChecked).length;
    setTotalCost(total);
    setCheckedItems(checked);
  }, [groceryItems]);

  const handleItemCheck = (itemId: string) => {
    setGroceryItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? {...item, isChecked: !item.isChecked} : item
      )
    );
  };

  const handleClearChecked = () => {
    Alert.alert(
      'Clear Checked Items',
      'Are you sure you want to remove all checked items from your list?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setGroceryItems(prevItems =>
              prevItems.filter(item => !item.isChecked)
            );
          },
        },
      ]
    );
  };

  const handleGenerateList = () => {
    // TODO: Generate grocery list from meal plan
    console.log('Generating grocery list from meal plan...');
  };

  const handleAddItem = () => {
    // TODO: Add custom item to list
    console.log('Adding custom item...');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Produce':
        return 'local-grocery-store';
      case 'Meat & Seafood':
        return 'restaurant';
      case 'Dairy':
        return 'local-drink';
      case 'Grains':
        return 'grain';
      case 'Bakery':
        return 'cake';
      case 'Pantry':
        return 'kitchen';
      default:
        return 'shopping-cart';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Produce':
        return '#4CAF50';
      case 'Meat & Seafood':
        return '#F44336';
      case 'Dairy':
        return '#2196F3';
      case 'Grains':
        return '#FF9800';
      case 'Bakery':
        return '#9C27B0';
      case 'Pantry':
        return '#795548';
      default:
        return '#757575';
    }
  };

  const groupItemsByCategory = (items: GroceryItem[]): GroceryCategory[] => {
    const categories: {[key: string]: GroceryItem[]} = {};
    
    items.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });

    return Object.keys(categories).map(categoryName => {
      const categoryItems = categories[categoryName];
      return {
        name: categoryName,
        items: categoryItems,
        totalItems: categoryItems.length,
        checkedItems: categoryItems.filter(item => item.isChecked).length,
      };
    });
  };

  const filteredItems = groceryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = groupItemsByCategory(filteredItems);

  const renderGroceryItem = ({item}: {item: GroceryItem}) => (
    <Surface style={styles.groceryItem}>
      <View style={styles.itemContent}>
        <Checkbox
          status={item.isChecked ? 'checked' : 'unchecked'}
          onPress={() => handleItemCheck(item.id)}
          color="#2E7D32"
        />
        <View style={styles.itemDetails}>
          <Text style={[
            styles.itemName,
            item.isChecked && styles.checkedItemName
          ]}>
            {item.name}
          </Text>
          <Text style={styles.itemQuantity}>
            {item.quantity} {item.unit}
          </Text>
          {item.notes && (
            <Text style={styles.itemNotes}>{item.notes}</Text>
          )}
        </View>
        <View style={styles.itemCost}>
          <Text style={[
            styles.costText,
            item.isChecked && styles.checkedCostText
          ]}>
            ${item.estimatedCost.toFixed(2)}
          </Text>
        </View>
      </View>
    </Surface>
  );

  const renderCategory = ({item}: {item: GroceryCategory}) => (
    <Card style={styles.categoryCard}>
      <Card.Content>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryTitle}>
            <Icon
              name={getCategoryIcon(item.name)}
              size={20}
              color={getCategoryColor(item.name)}
            />
            <Text style={styles.categoryName}>{item.name}</Text>
          </View>
          <Chip
            mode="outlined"
            style={[
              styles.categoryChip,
              {borderColor: getCategoryColor(item.name)}
            ]}
            textStyle={{color: getCategoryColor(item.name)}}>
            {item.checkedItems}/{item.totalItems}
          </Chip>
        </View>
        <FlatList
          data={item.items}
          renderItem={renderGroceryItem}
          keyExtractor={groceryItem => groceryItem.id}
          showsVerticalScrollIndicator={false}
        />
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header with stats */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerRow}>
            <View>
              <Title style={styles.headerTitle}>Grocery List</Title>
              <Paragraph style={styles.headerSubtitle}>
                {checkedItems} of {groceryItems.length} items checked
              </Paragraph>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.totalCost}>${totalCost.toFixed(2)}</Text>
              <Text style={styles.totalLabel}>Total Cost</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Search bar */}
      <Card style={styles.searchCard}>
        <Card.Content>
          <Searchbar
            placeholder="Search items or categories..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
        </Card.Content>
      </Card>

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={handleGenerateList}
          style={styles.actionButton}
          icon="auto-awesome">
          Generate List
        </Button>
        <Button
          mode="outlined"
          onPress={handleClearChecked}
          style={styles.actionButton}
          icon="clear"
          disabled={checkedItems === 0}>
          Clear Checked
        </Button>
      </View>

      {/* Grocery list by category */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={category => category.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <FAB
        style={styles.fab}
        icon="add"
        onPress={handleAddItem}
        label="Add Item"
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
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    alignItems: 'center',
  },
  totalCost: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
  },
  searchCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: 'transparent',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  categoryCard: {
    marginBottom: 16,
    elevation: 4,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2E7D32',
  },
  categoryChip: {
    height: 24,
  },
  groceryItem: {
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  checkedItemName: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemNotes: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 2,
  },
  itemCost: {
    alignItems: 'flex-end',
  },
  costText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  checkedCostText: {
    color: '#999',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
});

export default GroceryListScreen;
