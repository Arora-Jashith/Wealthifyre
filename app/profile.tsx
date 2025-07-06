import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { mockUserProfile } from '@/mocks/user';
import { useAuthStore } from '@/store/auth-store';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Shield, 
  Bell, 
  HelpCircle, 
  Target 
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };
  
  const handleSettingsPress = () => {
    router.push('/settings');
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          {mockUserProfile.avatar ? (
            <Image 
              source={{ uri: mockUserProfile.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={40} color={colors.dark.text} />
            </View>
          )}
          
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{mockUserProfile.name}</Text>
            <Text style={styles.email}>{mockUserProfile.email}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <Settings size={24} color={colors.dark.text} />
        </TouchableOpacity>
      </View>
      
      <Card style={styles.financialGoalsCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Target size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Financial Goals</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        {mockUserProfile.financialGoals?.map((goal, index) => (
          <View key={index} style={styles.goalItem}>
            <View style={styles.goalBullet} />
            <Text style={styles.goalText}>{goal}</Text>
          </View>
        ))}
        
        <Button
          title="Add New Goal"
          variant="outline"
          size="small"
          style={styles.addGoalButton}
          onPress={() => {}}
        />
      </Card>
      
      <Card style={styles.preferencesCard}>
        <Text style={styles.preferencesTitle}>Preferences</Text>
        
        <TouchableOpacity style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <View style={[styles.preferenceIcon, { backgroundColor: `${colors.primary}30` }]}>
              <Bell size={20} color={colors.primary} />
            </View>
            <Text style={styles.preferenceText}>Notifications</Text>
          </View>
          <ChevronRight size={20} color={colors.dark.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <View style={[styles.preferenceIcon, { backgroundColor: `${colors.secondary}30` }]}>
              <Shield size={20} color={colors.secondary} />
            </View>
            <Text style={styles.preferenceText}>Privacy & Security</Text>
          </View>
          <ChevronRight size={20} color={colors.dark.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <View style={[styles.preferenceIcon, { backgroundColor: `${colors.primary}30` }]}>
              <HelpCircle size={20} color={colors.primary} />
            </View>
            <Text style={styles.preferenceText}>Help & Support</Text>
          </View>
          <ChevronRight size={20} color={colors.dark.textSecondary} />
        </TouchableOpacity>
      </Card>
      
      <Button
        title="Log Out"
        variant="outline"
        style={styles.logoutButton}
        icon={<LogOut size={20} color={colors.accent} />}
        textStyle={{ color: colors.accent }}
        onPress={handleLogout}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    color: colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: colors.dark.textSecondary,
    fontSize: 14,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  financialGoalsCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  editText: {
    color: colors.primary,
    fontSize: 14,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  goalText: {
    color: colors.dark.text,
    fontSize: 16,
    lineHeight: 22,
  },
  addGoalButton: {
    marginTop: 8,
  },
  preferencesCard: {
    marginBottom: 24,
  },
  preferencesTitle: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  preferenceText: {
    color: colors.dark.text,
    fontSize: 16,
  },
  logoutButton: {
    marginBottom: 24,
    borderColor: colors.accent,
  },
});