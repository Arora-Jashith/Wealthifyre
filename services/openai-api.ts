import axios from 'axios';
import { useFinanceStore } from '@/store/finance-store';
import { router } from 'expo-router';
import { Alert } from 'react-native';

// In a real application, you would use environment variables for API keys
// For this demo, we're using a placeholder that would need to be replaced with a real API key
// const API_KEY = 'YOUR_OPENAI_API_KEY_HERE'; // <-- Remove hardcoded key. Set this securely via environment variable or config.
const API_KEY = '';
const API_URL = 'https://api.openai.com/v1/chat/completions';

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Store conversation history for context
let conversationHistory: { role: string; content: string }[] = [
  {
    role: 'system',
    content: `You are Wealthifyre CFO, a sophisticated personal financial advisor. 
    Your role is to provide expert financial guidance, analysis, and recommendations.
    Always consider the user's financial context when available.
    Respond in a friendly, professional tone.
    Focus on practical, actionable financial advice.
    When the user asks about specific financial actions (like investing, transferring money, etc.), 
    provide a direct link to the relevant section of the app.
    If asked to generate reports or summaries, offer to create a PDF of the requested information.
    You have access to the user's complete financial data including accounts, transactions, investments, and budgets.`
  }
];

/**
 * Sends a message to the OpenAI API and returns the response
 * @param userMessage The message from the user
 * @param includeFinancialContext Optional financial context to include with the message
 */
export async function sendMessageToOpenAI(userMessage: string, includeFinancialContext: boolean = true): Promise<string> {
  try {
    // Get financial context if requested
    if (includeFinancialContext) {
      const { accounts, transactions, forecast, investments } = useFinanceStore.getState();
      
      // Calculate some financial metrics for context
      const totalBalance = accounts
        .filter(account => account.type !== 'credit')
        .reduce((sum, account) => sum + account.balance, 0);
      
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
      const totalInvestments = investments.reduce((sum, inv) => sum + inv.value, 0);
      
      // Add financial context to conversation history
      conversationHistory.push({
        role: 'system',
        content: `
        Current financial context (${new Date().toLocaleDateString()}):
        - Total balance across accounts: $${totalBalance.toFixed(2)}
        - Recent monthly income: $${totalIncome.toFixed(2)}
        - Recent monthly expenses: $${totalExpenses.toFixed(2)}
        - Total investments: $${totalInvestments.toFixed(2)}
        - Recent transactions: ${JSON.stringify(transactions.slice(0, 5))}
        - Investment holdings: ${JSON.stringify(investments.slice(0, 5))}
        - Accounts: ${JSON.stringify(accounts)}
        `
      });
    }
    
    // Add user message to conversation history
    conversationHistory.push({
      role: 'user',
      content: userMessage
    });
    
    // Keep conversation history to a reasonable size
    if (conversationHistory.length > 20) {
      // Keep system message and last 19 messages
      conversationHistory = [
        conversationHistory[0],
        ...conversationHistory.slice(conversationHistory.length - 19)
      ];
    }
    
    const response = await axios.post<OpenAIResponse>(
      API_URL,
      {
        model: 'gpt-4-turbo',
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );
    
    // Extract the response text
    if (response.data.choices && response.data.choices.length > 0) {
      const responseText = response.data.choices[0].message.content;
      
      // Add assistant response to conversation history
      conversationHistory.push({
        role: 'assistant',
        content: responseText
      });
      
      return responseText;
    } else {
      return "I'm sorry, I couldn't generate a response at the moment. Please try again later.";
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}

/**
 * Parses actionable links from the assistant's response
 * @param response The assistant's response text
 * @returns An object with action type and parameters if found
 */
export function parseActionableLinks(response: string): { action: string; params: any } | null {
  // Check for investment action
  const investMatch = response.match(/\[Invest\s+\$(\d+(?:\.\d+)?)\s+in\s+([^\]]+)\]/i);
  if (investMatch) {
    return {
      action: 'invest',
      params: {
        amount: parseFloat(investMatch[1]),
        target: investMatch[2].trim()
      }
    };
  }
  
  // Check for transfer action
  const transferMatch = response.match(/\[Transfer\s+\$(\d+(?:\.\d+)?)\s+from\s+([^\]]+)\s+to\s+([^\]]+)\]/i);
  if (transferMatch) {
    return {
      action: 'transfer',
      params: {
        amount: parseFloat(transferMatch[1]),
        from: transferMatch[2].trim(),
        to: transferMatch[3].trim()
      }
    };
  }
  
  // Check for report generation
  const reportMatch = response.match(/\[Generate\s+([^\]]+)\s+Report\]/i);
  if (reportMatch) {
    return {
      action: 'report',
      params: {
        type: reportMatch[1].trim()
      }
    };
  }
  
  // Check for PDF generation
  const pdfMatch = response.match(/\[Generate\s+([^\]]+)\s+PDF\]/i);
  if (pdfMatch) {
    return {
      action: 'report',
      params: {
        type: pdfMatch[1].trim()
      }
    };
  }
  
  return null;
}

/**
 * Executes an action based on the parsed actionable link
 * @param action The action object with type and parameters
 */
export function executeAction(action: { action: string; params: any }): void {
  switch (action.action) {
    case 'invest':
      router.push({
        pathname: '/purchase-investment',
        params: { 
          amount: action.params.amount,
          target: action.params.target
        }
      });
      break;
      
    case 'transfer':
      router.push({
        pathname: '/send-money',
        params: {
          amount: action.params.amount,
          from: action.params.from,
          to: action.params.to
        }
      });
      break;
      
    case 'report':
      // Import dynamically to avoid circular dependencies
      import('./pdf-generator').then(async (pdfModule) => {
        try {
          // Show loading alert
          Alert.alert('Generating Report', `Creating ${action.params.type} report. Please wait...`);
          
          // Generate the PDF
          const pdfUri = await pdfModule.generatePdfReport(action.params.type);
          
          if (pdfUri) {
            // Show success alert with option to view/share
            Alert.alert(
              'Report Generated',
              `Your ${action.params.type} report has been created successfully.`,
              [
                {
                  text: 'View/Share',
                  onPress: () => pdfModule.sharePdfReport(pdfUri)
                },
                { text: 'Close', style: 'cancel' }
              ]
            );
          }
        } catch (error) {
          console.error('Error in PDF generation:', error);
          Alert.alert('Error', 'Failed to generate the report. Please try again.');
        }
      }).catch(error => {
        console.error('Error importing PDF generator:', error);
        Alert.alert('Error', 'Failed to load the report generator. Please try again.');
      });
      break;
      
    default:
      console.log('Unknown action type:', action.action);
  }
}

// Mock implementation for development and testing
export async function mockSendMessageToOpenAI(userMessage: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check for specific keywords to provide relevant responses
  const lowerCaseMessage = userMessage.toLowerCase();
  
  if (lowerCaseMessage.includes('invest') && lowerCaseMessage.includes('$')) {
    // Extract amount if present
    const amountMatch = userMessage.match(/\$(\d+)/);
    const amount = amountMatch ? amountMatch[1] : '500';
    
    if (lowerCaseMessage.includes('tech') || lowerCaseMessage.includes('technology')) {
      return `I can help you invest $${amount} in technology ETFs. Based on your risk profile and current portfolio, I recommend VGT (Vanguard Information Technology ETF) or QQQ (Invesco QQQ Trust). \n\n[Invest $${amount} in Tech ETF]`;
    } else if (lowerCaseMessage.includes('dividend')) {
      return `Great choice! Investing $${amount} in dividend stocks can provide steady income. I recommend SCHD (Schwab U.S. Dividend Equity ETF) based on your current portfolio allocation. \n\n[Invest $${amount} in Dividend ETF]`;
    } else {
      return `I'd be happy to help you invest $${amount}. Based on your current portfolio allocation, I recommend a diversified ETF like VTI (Vanguard Total Stock Market ETF). \n\n[Invest $${amount} in VTI]`;
    }
  }
  
  if (lowerCaseMessage.includes('spend') && lowerCaseMessage.includes('groceries')) {
    return "Looking at your recent transactions, you spent $342.87 on groceries last month. This is about 12% of your total monthly expenses, which is within the recommended range of 10-15% for food expenses.";
  }
  
  if (lowerCaseMessage.includes('savings goal') || lowerCaseMessage.includes('save for')) {
    return "Based on your current income and expenses, I recommend saving $750 per month toward your goal. At this rate, you'll reach your target of $10,000 in approximately 13 months. Would you like me to set up an automatic transfer to your savings account?";
  }
  
  if (lowerCaseMessage.includes('portfolio') && lowerCaseMessage.includes('report')) {
    return "I've analyzed your investment portfolio. Your current allocation is 65% stocks, 25% bonds, and 10% alternatives. Your YTD return is 8.2%, outperforming the S&P 500 by 0.7%. \n\n[Generate Portfolio Report]";
  }
  
  if (lowerCaseMessage.includes('generate') && lowerCaseMessage.includes('pdf')) {
    let reportType = 'Summary';
    
    if (lowerCaseMessage.includes('expense') || lowerCaseMessage.includes('spending')) {
      reportType = 'Expense';
    } else if (lowerCaseMessage.includes('investment') || lowerCaseMessage.includes('portfolio')) {
      reportType = 'Investment';
    }
    
    return `I'll generate a ${reportType} PDF report for you right away. This will include all your relevant financial data in an easy-to-read format. \n\n[Generate ${reportType} PDF]`;
  }
  
  if (lowerCaseMessage.includes('transfer') || lowerCaseMessage.includes('send money')) {
    return "I can help you transfer money between your accounts. Based on your cash flow analysis, you can safely transfer $1,000 from your checking to your high-yield savings account. \n\n[Transfer $1000 from Checking to Savings]";
  }
  
  // Default response
  return "As your personal CFO, I'm here to help you make smart financial decisions. I can assist with budgeting, investing, saving, debt management, and more. What specific aspect of your finances would you like to discuss today?";
}
