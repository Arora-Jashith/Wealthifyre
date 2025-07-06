import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Image,
  Linking,
  Pressable,
  Alert,
  ScrollView
} from 'react-native';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  Download, 
  ChevronRight, 
  ArrowRight,
  BarChart2,
  DollarSign,
  PieChart,
  Sparkles
} from 'lucide-react-native';
import { sendMessageToGemini, mockSendMessageToGemini } from '@/services/gemini-api';
import { parseActionableLinks, executeAction } from '@/services/openai-api';
import Modal from 'react-native-modal';

const { height: screenHeight } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  actions?: ActionLink[];
}

interface ActionLink {
  type: 'invest' | 'transfer' | 'report';
  label: string;
  params: any;
}

export default function AssistantScreen() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Personal CFO at Wealthifyre. I can help you manage your finances, invest wisely, and plan for your financial future. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [backupMode, setBackupMode] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  
  // Suggested questions for the user
  const suggestions = [
    "Summarize my spending last month",
    "How is my investment portfolio doing?",
    "Generate a report of all expenses in Q3",
    "What are my biggest expense categories?"
  ];
  
  // Effect to hide suggestions after the first user message is sent
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].sender === 'user') {
      setShowSuggestions(false);
    }
  }, [messages]);
  
  const handleSend = async (message: string = input) => {
    if (!message.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    // Suggestions hidden by useEffect after the user sends a message
    
    try {
      // Call Gemini API
      let response = await sendMessageToGemini(message.trim());
      if (response === '__BACKUP_MODE__') {
        setBackupMode(true);
        response = await mockSendMessageToGemini(message.trim());
      } else {
        setBackupMode(false);
      }
      
      // Parse actionable links if any
      // Note: Actionable links parsing might need adjustment based on Gemini's output format
      const actionLink = parseActionableLinks(response); // Assuming this function works with Gemini output or is adjusted
      const actions: ActionLink[] = [];
      
      if (actionLink) {
        actions.push({
          type: actionLink.action as 'invest' | 'transfer' | 'report',
          label: getActionLabel(actionLink.action, actionLink.params),
          params: actionLink.params
        });
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
        actions: actions.length > 0 ? actions : undefined
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, Wealthifyre Assistant is temporarily unavailable. Please try again later.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getActionLabel = (action: string, params: any): string => {
    switch (action) {
      case 'invest':
        return `Invest ${params.amount ? `$${params.amount}` : 'amount'} in ${params.target || 'target'}`;
      case 'transfer':
        return `Transfer ${params.amount ? `$${params.amount}` : 'amount'} from ${params.from || 'source'} to ${params.to || 'destination'}`;
      case 'report':
        return `Generate ${params.type || 'Financial'} Report`;
      default:
        return 'Take Action';
    }
  };
  
  const handleActionPress = async (action: ActionLink) => {
    if (action.type === 'report') {
      try {
        // Show loading alert
        Alert.alert('Generating Report', `Creating ${action.params.type} report. Please wait...`);
        
        // Import the PDF generator module
        const pdfGenerator = require('@/services/pdf-generator');
        
        // Generate the PDF
        const pdfUri = await pdfGenerator.generatePdfReport(action.params.type);
        
        if (pdfUri) {
          // Show success alert with option to view/share
          Alert.alert(
            'Report Generated',
            `Your ${action.params.type} report has been created successfully.`,
            [
              {
                text: 'View/Share',
                onPress: () => pdfGenerator.sharePdfReport(pdfUri)
              },
              { text: 'Close', style: 'cancel' }
            ]
          );
        } else {
          throw new Error('Failed to generate PDF');
        }
      } catch (error) {
        console.error('Error in PDF generation:', error);
        Alert.alert(
          'Error',
          'Failed to generate the report. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } else {
      // Handle other action types
      Alert.alert('Action Triggered', `Type: ${action.type}, Params: ${JSON.stringify(action.params)}`);
    }
  };
  
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  const  renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.assistantMessageContainer]}>
        {!isUser && (
          // Avatar placeholder - can be replaced with a specific icon or image
          <View style={styles.avatarContainer}>
            {/* <DollarSign size={16} color={colors.primary} /> */}
            {/* Placeholder for bot icon or avatar */}
          </View>
        )}
        
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={isUser ? styles.userMessageText : styles.assistantMessageText}>
            {item.text}
          </Text>
          
          {item.actions && item.actions.length > 0 && (
            <View style={styles.actionsContainer}>
              {item.actions.map((action, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.actionButton}
                  onPress={() => handleActionPress(action)}
                >
                  <Text style={styles.actionButtonText}>{action.label}</Text>
                  {/* ArrowRight icon is subtle in B&W theme */}
                  <ArrowRight size={16} color={colors.primary} /> 
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <Text style={[styles.messageTime, isUser ? styles.userMessageTime : styles.assistantMessageTime]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Backup mode banner */}
      {backupMode && (
        <View style={styles.backupBanner}>
          <Text style={styles.backupBannerText}>AI is in backup mode. Some responses may be limited.</Text>
        </View>
      )}
      
      {/* Main chat content area */}
      <View style={styles.mainChatArea}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>How can I help you with your finances today?</Text>
          <Text style={styles.headerSubtitle}>Let's make a plan together.</Text>
        </View>
        
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} // Auto-scroll on new message
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })} // Auto-scroll on layout change (keyboard)
        />
        
        {/* Suggestions */}
        {showSuggestions && messages.length <= 1 && ( // Show suggestions only initially
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsTitle}>Try asking</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.suggestionButton}
                  onPress={() => handleSend(suggestion)}
                >
                  <Sparkles size={16} color={colors.textSecondary} style={styles.suggestionIcon} />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {/* Typing Indicator */}
        {isLoading && (
          <View style={styles.typingIndicatorContainer}>
            <View style={styles.typingIndicatorDot} />
            <View style={styles.typingIndicatorDot} />
            <View style={styles.typingIndicatorDot} />
          </View>
        )}
        
        {/* Input Bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust offset as needed
          style={[styles.inputBarContainer, { marginBottom: 80 }]} // Add bottom margin to lift it above the navbar
        >
          <View style={styles.inputWrapper}>
            <Sparkles size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Message Wealthifyre Copilot"
              placeholderTextColor={colors.textSecondary}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500} // Keep max length reasonable
            />
            {/* PDF Generate Button */}
            <TouchableOpacity 
              style={styles.pdfButton}
              onPress={() => setShowPdfModal(true)} // Keep existing modal functionality
            >
              <FileText size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={() => handleSend()} // Use the main handleSend function
              disabled={!input.trim() || isLoading} // Disable send if input is empty or loading
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} size="small" />
              ) : (
                <Send size={20} color={colors.background} />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
      
      {/* PDF Modal */}
      <Modal isVisible={showPdfModal} onBackdropPress={() => setShowPdfModal(false)}>
        <View style={styles.pdfModalContent}>
          <Text style={styles.pdfModalTitle}>Generate/View Expense Report</Text>
          <Text style={styles.pdfModalDesc}>Create a detailed PDF of your recent expenses, categories, and balances. You can view or share it instantly.</Text>
          <TouchableOpacity style={styles.pdfModalButton} onPress={() => { setShowPdfModal(false); handleActionPress({ type: 'report', label: 'Generate Expense Report', params: { type: 'Expense' } }); }}>
            <FileText size={20} color={colors.background} />
            <Text style={styles.pdfModalButtonText}>Generate Expense Report</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 80, // Add padding to the bottom to prevent content from being hidden by the navbar
  },
  mainChatArea: {
    flex: 1,
    backgroundColor: colors.background // Ensure chat area is also black
 // Add significant padding to the bottom of the main chat area to accommodate the input bar and navbar
  },
  headerContainer: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.background, // Black header background
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text, // White text for title
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary, // Light gray text for subtitle
    marginTop: 4,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 150, // Increased padding to ensure space for input bar and navbar
  },
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    marginRight: 8,
    // Removed specific avatar styling, can add placeholder icon here if needed
  },
  messageBubble: {
    borderRadius: 16,
    padding: 10,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: colors.tertiary, // Medium gray background for user
    marginLeft: 'auto',
    borderBottomRightRadius: 4, // Keep rounded corners except bottom right
  },
  assistantBubble: {
    backgroundColor: colors.card, // Very dark gray background for assistant
    marginRight: 'auto',
    borderBottomLeftRadius: 4, // Keep rounded corners except bottom left
  },
  userMessageText: {
    color: colors.background, // Black text on gray background
    fontSize: 15,
    lineHeight: 20,
  },
  assistantMessageText: {
    color: colors.text, // White text on dark gray background
    fontSize: 15,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 2,
    opacity: 0.6,
  },
  userMessageTime: {
    color: colors.background, // Black time on gray background
  },
  assistantMessageTime: {
    color: colors.textSecondary, // Light gray time on dark gray background
  },
  actionsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border, // Dark gray border
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card, // Dark gray background for action buttons
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  actionButtonText: {
    color: colors.primary, // White text for action buttons
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  suggestionsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background, // Black background for suggestions section
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text, // White text for title
    marginBottom: 10,
  },
  suggestionsScroll: {
    paddingVertical: 4,
  },
  suggestionButton: {
    backgroundColor: colors.card, // Very dark gray background for suggestions
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    marginRight: 8,
  },
  suggestionText: {
    color: colors.textSecondary, // Light gray text for suggestions
    fontSize: 14,
  },
  typingIndicatorContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.card, // Dark gray background
    alignSelf: 'flex-start',
    marginVertical: 6,
    marginLeft: 16 + 8 + 32, // Match assistant bubble alignment (padding + avatar + gap)
  },
  typingIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textSecondary, // Light gray dots
    marginHorizontal: 2,
    opacity: 0.7,
  },
  inputBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: colors.background, // Black background for input bar area
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card, // Dark gray background for input wrapper
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border, // Dark gray border
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.text, // White text input
    fontSize: 16,
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary, // White background for send button
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  pdfButton: { // Add new style for PDF button
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    // Optional: Add a background color or border if needed
  },
  pdfModalContent: {
    backgroundColor: colors.card, // Dark gray modal background
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1, // Added border
    borderColor: colors.border, // Dark gray border
  },
  pdfModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary, // White text for title
    marginBottom: 8,
    textAlign: 'center',
  },
  pdfModalDesc: {
    color: colors.textSecondary, // Light gray text for description
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.9,
  },
  pdfModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary, // White button background
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    borderWidth: 1, // Added border
    borderColor: colors.background, // Black border
  },
  pdfModalButtonText: {
    color: colors.background, // Black text for button
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
  backupBanner: {
    backgroundColor: colors.card, // Dark gray background for banner
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border, // Dark gray border
  },
  backupBannerText: {
    color: colors.warning, // Using yellow for warning state
    fontWeight: '600',
    fontSize: 13,
  },
});