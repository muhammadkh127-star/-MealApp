import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  Surface,
  Switch,
  List,
  Divider,
  Avatar,
  Chip,
  Modal,
  Portal,
  TextInput,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface UserProfile {
  name: string;
  email: string;
  dietaryPreferences: string[];
  allergies: string[];
  nutritionGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  budget: number;
  notifications: {
    mealReminders: boolean;
    groceryReminders: boolean;
    weeklyReports: boolean;
  };
}

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    dietaryPreferences: ['vegetarian', 'gluten-free'],
    allergies: ['nuts', 'dairy'],
    nutritionGoals: {
      calories: 2000,
      protein: 150,
      carbs: 250,
      fat: 65,
    },
    budget: 100,
    notifications: {
      mealReminders: true,
      groceryReminders: true,
      weeklyReports: false,
    },
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const dietaryOptions = [
    'Vegan', 'Vegetarian', 'Pescatarian', 'Keto', 'Paleo',
    'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'High-Protein',
    'Mediterranean', 'Whole30', 'Raw Food'
  ];

  const allergyOptions = [
    'Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Shellfish',
    'Fish', 'Sesame', 'Sulfites', 'None'
  ];

  const handleEditProfile = (field: string, currentValue: any) => {
    setEditingField(field);
    setEditValue(Array.isArray(currentValue) ? currentValue.join(', ') : currentValue.toString());
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingField) {
      let newValue: any = editValue;
      
      if (editingField === 'dietaryPreferences' || editingField === 'allergies') {
        newValue = editValue.split(',').map((item: string) => item.trim()).filter(Boolean);
      } else if (editingField.startsWith('nutritionGoals.')) {
        const subField = editingField.split('.')[1];
        setProfile(prev => ({
          ...prev,
          nutritionGoals: {
            ...prev.nutritionGoals,
            [subField]: parseInt(editValue) || 0,
          }
        }));
        setShowEditModal(false);
        return;
      } else if (editingField === 'budget') {
        newValue = parseFloat(editValue) || 0;
      }

      setProfile(prev => ({
        ...prev,
        [editingField]: newValue,
      }));
    }
    setShowEditModal(false);
  };

  const handleNotificationToggle = (key: keyof typeof profile.notifications) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Logout', style: 'destructive', onPress: () => {
          // TODO: Implement logout logic
          console.log('Logging out...');
        }},
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', style: 'destructive', onPress: () => {
          // TODO: Implement account deletion
          console.log('Deleting account...');
        }},
      ]
    );
  };

  const renderProfileItem = (label: string, value: any, onPress?: () => void) => (
    <List.Item
      title={label}
      description={Array.isArray(value) ? value.join(', ') : value.toString()}
      right={onPress ? () => <Icon name="chevron-right" size={20} color="#666" /> : undefined}
      onPress={onPress}
      style={styles.profileItem}
    />
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Text
              size={80}
              label={profile.name.split(' ').map(n => n[0]).join('')}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Title style={styles.profileName}>{profile.name}</Title>
              <Paragraph style={styles.profileEmail}>{profile.email}</Paragraph>
              <Button
                mode="outlined"
                onPress={() => handleEditProfile('name', profile.name)}
                style={styles.editButton}
                icon="edit">
                Edit Profile
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Dietary Preferences */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Dietary Preferences</Title>
          <View style={styles.chipContainer}>
            {profile.dietaryPreferences.map(preference => (
              <Chip key={preference} style={styles.chip}>
                {preference}
              </Chip>
            ))}
          </View>
          <Button
            mode="text"
            onPress={() => handleEditProfile('dietaryPreferences', profile.dietaryPreferences)}
            style={styles.editLink}>
            Edit Preferences
          </Button>
        </Card.Content>
      </Card>

      {/* Allergies */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Allergies & Restrictions</Title>
          <View style={styles.chipContainer}>
            {profile.allergies.map(allergy => (
              <Chip key={allergy} style={[styles.chip, styles.allergyChip]}>
                {allergy}
              </Chip>
            ))}
          </View>
          <Button
            mode="text"
            onPress={() => handleEditProfile('allergies', profile.allergies)}
            style={styles.editLink}>
            Edit Allergies
          </Button>
        </Card.Content>
      </Card>

      {/* Nutrition Goals */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Nutrition Goals</Title>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>{profile.nutritionGoals.calories}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Protein (g)</Text>
              <Text style={styles.nutritionValue}>{profile.nutritionGoals.protein}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Carbs (g)</Text>
              <Text style={styles.nutritionValue}>{profile.nutritionGoals.carbs}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Fat (g)</Text>
              <Text style={styles.nutritionValue}>{profile.nutritionGoals.fat}</Text>
            </View>
          </View>
          <Button
            mode="text"
            onPress={() => handleEditProfile('nutritionGoals', profile.nutritionGoals)}
            style={styles.editLink}>
            Edit Goals
          </Button>
        </Card.Content>
      </Card>

      {/* Budget */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Weekly Budget</Title>
          <Text style={styles.budgetAmount}>${profile.budget}</Text>
          <Button
            mode="text"
            onPress={() => handleEditProfile('budget', profile.budget)}
            style={styles.editLink}>
            Edit Budget
          </Button>
        </Card.Content>
      </Card>

      {/* Notifications */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Notifications</Title>
          <List.Item
            title="Meal Reminders"
            description="Get reminded about upcoming meals"
            right={() => (
              <Switch
                value={profile.notifications.mealReminders}
                onValueChange={() => handleNotificationToggle('mealReminders')}
                color="#2E7D32"
              />
            )}
          />
          <Divider />
          <List.Item
            title="Grocery Reminders"
            description="Get reminded to go grocery shopping"
            right={() => (
              <Switch
                value={profile.notifications.groceryReminders}
                onValueChange={() => handleNotificationToggle('groceryReminders')}
                color="#2E7D32"
              />
            )}
          />
          <Divider />
          <List.Item
            title="Weekly Reports"
            description="Receive weekly nutrition and spending reports"
            right={() => (
              <Switch
                value={profile.notifications.weeklyReports}
                onValueChange={() => handleNotificationToggle('weeklyReports')}
                color="#2E7D32"
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* App Settings */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>App Settings</Title>
          <List.Item
            title="Language"
            description="English"
            right={() => <Icon name="chevron-right" size={20} color="#666" />}
            onPress={() => console.log('Change language')}
          />
          <Divider />
          <List.Item
            title="Units"
            description="Imperial (lbs, oz, °F)"
            right={() => <Icon name="chevron-right" size={20} color="#666" />}
            onPress={() => console.log('Change units')}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            right={() => <Icon name="chevron-right" size={20} color="#666" />}
            onPress={() => console.log('View privacy policy')}
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            right={() => <Icon name="chevron-right" size={20} color="#666" />}
            onPress={() => console.log('View terms')}
          />
        </Card.Content>
      </Card>

      {/* Account Actions */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Account</Title>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.actionButton}
            icon="logout">
            Logout
          </Button>
          <Button
            mode="text"
            onPress={handleDeleteAccount}
            style={[styles.actionButton, styles.deleteButton]}
            textColor="#F44336"
            icon="delete">
            Delete Account
          </Button>
        </Card.Content>
      </Card>

      {/* Edit Modal */}
      <Portal>
        <Modal
          visible={showEditModal}
          onDismiss={() => setShowEditModal(false)}
          contentContainerStyle={styles.modalContainer}>
          <Card style={styles.modalCard}>
            <Card.Content>
              <Title style={styles.modalTitle}>
                Edit {editingField?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Title>
              <TextInput
                label="Value"
                value={editValue}
                onChangeText={setEditValue}
                style={styles.modalInput}
                multiline={editingField === 'dietaryPreferences' || editingField === 'allergies'}
              />
              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setShowEditModal(false)}
                  style={styles.modalButton}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSaveEdit}
                  style={styles.modalButton}>
                  Save
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </ScrollView>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#2E7D32',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    marginTop: 8,
  },
  sectionCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  chip: {
    backgroundColor: '#E8F5E8',
  },
  allergyChip: {
    backgroundColor: '#FFEBEE',
  },
  editLink: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  nutritionItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8,
  },
  profileItem: {
    paddingVertical: 8,
  },
  actionButton: {
    marginBottom: 8,
  },
  deleteButton: {
    marginTop: 8,
  },
  modalContainer: {
    padding: 20,
  },
  modalCard: {
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  modalInput: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default ProfileScreen;
