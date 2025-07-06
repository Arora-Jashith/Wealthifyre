import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settings-store';
import { 
  Moon, 
  Bell, 
  Coins, 
  ChevronRight, 
  Shield, 
  HelpCircle, 
  Info 
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { 
    theme, 
    notificationsEnabled, 
    roundUpEnabled, 
    roundUpMultiplier,
    toggleNotifications,
    toggleRoundUp,
    setRoundUpMultiplier
  } = useSettingsStore();
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>App Preferences</Text>
      
      <Card style={styles.card}>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: `${colors.primary}30` }]}>
              <Moon size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={() => {}}
            trackColor={{ false: colors.dark.border, true: `${colors.primary}80` }}
            thumbColor={theme === 'dark' ? colors.primary : colors.dark.textSecondary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: `${colors.secondary}30` }]}>
              <Bell size={20} color={colors.secondary} />
            </View>
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.dark.border, true: `${colors.primary}80` }}
            thumbColor={notificationsEnabled ? colors.primary : colors.dark.textSecondary}
          />
        </View>
      </Card>
      
      <Text style={styles.sectionTitle}>Investment Settings</Text>
      
      <Card style={styles.card}>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: `${colors.primary}30` }]}>
              <Coins size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.settingText}>Round-Up Investments</Text>
              <Text style={styles.settingDescription}>
                Automatically invest spare change from transactions
              </Text>
            </View>
          </View>
          <Switch
            value={roundUpEnabled}
            onValueChange={toggleRoundUp}
            trackColor={{ false: colors.dark.border, true: `${colors.primary}80` }}
            thumbColor={roundUpEnabled ? colors.primary : colors.dark.textSecondary}
          />
        </View>
        
        {roundUpEnabled && (
          <View style={styles.multiplierContainer}>
            <Text style={styles.multiplierTitle}>Round-Up Multiplier</Text>
            
            <View style={styles.multiplierOptions}>
              <TouchableOpacity
                style={[
                  styles.multiplierOption,
                  roundUpMultiplier === 1 && styles.activeMultiplier
                ]}
                onPress={() => setRoundUpMultiplier(1)}
              >
                <Text style={[
                  styles.multiplierText,
                  roundUpMultiplier === 1 && styles.activeMultiplierText
                ]}>
                  1x
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.multiplierOption,
                  roundUpMultiplier === 2 && styles.activeMultiplier
                ]}
                onPress={() => setRoundUpMultiplier(2)}
              >
                <Text style={[
                  styles.multiplierText,
                  roundUpMultiplier === 2 && styles.activeMultiplierText
                ]}>
                  2x
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.multiplierOption,
                  roundUpMultiplier === 3 && styles.activeMultiplier
                ]}
                onPress={() => setRoundUpMultiplier(3)}
              >
                <Text style={[
                  styles.multiplierText,
                  roundUpMultiplier === 3 && styles.activeMultiplierText
                ]}>
                  3x
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Card>
      
      <Text style={styles.sectionTitle}>Support</Text>
      
      <Card style={styles.card}>
        <TouchableOpacity style={styles.linkItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: `${colors.secondary}30` }]}>
              <Shield size={20} color={colors.secondary} />
            </View>
            <Text style={styles.settingText}>Privacy Policy</Text>
          </View>
          <ChevronRight size={20} color={colors.dark.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: `${colors.primary}30` }]}>
              <Info size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Terms of Service</Text>
          </View>
          <ChevronRight size={20} color={colors.dark.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: `${colors.secondary}30` }]}>
              <HelpCircle size={20} color={colors.secondary} />
            </View>
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
          <ChevronRight size={20} color={colors.dark.textSecondary} />
        </TouchableOpacity>
      </Card>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Wealthifyre v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    padding: 16,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    color: colors.dark.text,
    fontSize: 16,
  },
  settingDescription: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    marginTop: 2,
    width: '90%',
  },
  multiplierContainer: {
    paddingTop: 16,
  },
  multiplierTitle: {
    color: colors.dark.text,
    fontSize: 16,
    marginBottom: 12,
  },
  multiplierOptions: {
    flexDirection: 'row',
  },
  multiplierOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.dark.cardAlt,
    marginRight: 8,
    alignItems: 'center',
  },
  activeMultiplier: {
    backgroundColor: colors.primary,
  },
  multiplierText: {
    color: colors.dark.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  activeMultiplierText: {
    color: colors.dark.text,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    color: colors.dark.textSecondary,
    fontSize: 14,
  },
});