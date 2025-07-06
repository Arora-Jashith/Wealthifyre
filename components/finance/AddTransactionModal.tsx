import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { 
  X, 
  CreditCard, 
  DollarSign, 
  Calendar,
  Tag,
  ShoppingBag,
  Coffee,
  Utensils,
  Home,
  Car,
  Tv,
  Zap,
  Briefcase,
  BookOpen,
  ShoppingCart,
  Heart
} from 'lucide-react-native';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

type CategoryOption = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
};

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose
}) => {
  const { addTransaction } = useFinanceStore();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [merchant, setMerchant] = useState('');
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  
  const categories: CategoryOption[] = [
    { 
      id: 'food', 
      name: 'Food', 
      icon: <ShoppingBag size={20} color={colors.categories.food} />,
      color: colors.categories.food
    },
    { 
      id: 'transport', 
      name: 'Transport', 
      icon: <Car size={20} color={colors.categories.transport} />,
      color: colors.categories.transport
    },
    { 
      id: 'entertainment', 
      name: 'Entertainment', 
      icon: <Tv size={20} color={colors.categories.entertainment} />,
      color: colors.categories.entertainment
    },
    { 
      id: 'utilities', 
      name: 'Utilities', 
      icon: <Zap size={20} color={colors.categories.electricity} />,
      color: colors.categories.electricity
    },
    { 
      id: 'shopping', 
      name: 'Shopping', 
      icon: <ShoppingCart size={20} color={colors.categories.shopping} />,
      color: colors.categories.shopping
    },
    { 
      id: 'housing', 
      name: 'Housing', 
      icon: <Home size={20} color={colors.categories.housing} />,
      color: colors.categories.housing
    },
    { 
      id: 'health', 
      name: 'Health', 
      icon: <Heart size={20} color={colors.categories.health} />,
      color: colors.categories.health
    },
    { 
      id: 'education', 
      name: 'Education', 
      icon: <BookOpen size={20} color={colors.categories.education} />,
      color: colors.categories.education
    },
  ];
  
  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('');
    setMerchant('');
    setTransactionType('expense');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleSubmit = () => {
    if (!amount || !description || !category) {
      // Show validation error
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      // Show validation error
      return;
    }
    
    // Create transaction object
    const newTransaction = {
      amount: transactionType === 'expense' ? -parsedAmount : parsedAmount,
      description,
      category,
      date: new Date().toISOString(),
      type: transactionType,
      merchant: merchant || undefined,
    };
    
    // Add to store
    addTransaction(newTransaction);
    
    // Close modal and reset form
    handleClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Add Transaction</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleClose}
              >
                <X size={20} color={colors.dark.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.content}>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'expense' && styles.activeTypeButton
                  ]}
                  onPress={() => setTransactionType('expense')}
                >
                  <Text style={[
                    styles.typeButtonText,
                    transactionType === 'expense' && styles.activeTypeButtonText
                  ]}>
                    Expense
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'income' && styles.activeTypeButton
                  ]}
                  onPress={() => setTransactionType('income')}
                >
                  <Text style={[
                    styles.typeButtonText,
                    transactionType === 'income' && styles.activeTypeButtonText
                  ]}>
                    Income
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputGroup}>
                <View style={styles.inputLabel}>
                  <DollarSign size={16} color={colors.dark.textSecondary} />
                  <Text style={styles.labelText}>Amount</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={colors.dark.textSecondary}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <View style={styles.inputLabel}>
                  <Tag size={16} color={colors.dark.textSecondary} />
                  <Text style={styles.labelText}>Description</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="What was this for?"
                  placeholderTextColor={colors.dark.textSecondary}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <View style={styles.inputLabel}>
                  <CreditCard size={16} color={colors.dark.textSecondary} />
                  <Text style={styles.labelText}>Merchant (Optional)</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Where did you spend it?"
                  placeholderTextColor={colors.dark.textSecondary}
                  value={merchant}
                  onChangeText={setMerchant}
                />
              </View>
              
              <Text style={styles.sectionTitle}>Category</Text>
              
              <View style={styles.categoriesContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryButton,
                      category === cat.id && { borderColor: cat.color }
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <View style={[
                      styles.categoryIcon,
                      { backgroundColor: `${cat.color}20` }
                    ]}>
                      {cat.icon}
                    </View>
                    <Text style={styles.categoryText}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Add Transaction</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.dark.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  title: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dark.cardAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.dark.cardAlt,
    borderRadius: 12,
    marginBottom: 24,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTypeButton: {
    backgroundColor: colors.dark.card,
  },
  typeButtonText: {
    color: colors.dark.textSecondary,
    fontWeight: '500',
  },
  activeTypeButtonText: {
    color: colors.dark.text,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelText: {
    color: colors.dark.textSecondary,
    marginLeft: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.dark.cardAlt,
    borderRadius: 12,
    padding: 16,
    color: colors.dark.text,
    fontSize: 16,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  categoryButton: {
    width: '25%',
    padding: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    color: colors.dark.text,
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.dark.cardAlt,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.dark.text,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.dark.buttonText,
    fontWeight: '600',
  },
});
