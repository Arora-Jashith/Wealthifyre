import axios, { AxiosError } from 'axios';
import { useFinanceStore } from '@/store/finance-store';

// In a real application, you would use environment variables for API keys
// For this demo, we're using a placeholder that would need to be replaced with a real API key
const API_KEY = 'AIzaSyBb_5tOnBjXlai_EINJWMYyfPbPNcJDhCM';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

/**
 * Sends a message to the Gemini API and returns the response
 * @param userMessage The message from the user
 * @param context Optional financial context to include with the message
 */
export async function sendMessageToGemini(userMessage: string, includeFinancialContext: boolean = true): Promise<string> {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // Get financial context if requested
      let context = '';
      
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
        
        context = `
        Financial context:
        - Total balance across accounts: $${totalBalance.toFixed(2)}
        - Recent monthly income: $${totalIncome.toFixed(2)}
        - Recent monthly expenses: $${totalExpenses.toFixed(2)}
        - Total investments: $${totalInvestments.toFixed(2)}
        - Recent transactions: ${JSON.stringify(transactions.slice(0, 3))}
        `;
      }
      
      // Prepare prompt with instructions for financial assistance
      const systemPrompt = `
      You are Wealthifyre AI, a highly disciplined personal financial copilot. 
– Always respond in **no more than three sentences total.** 
– If you must give a short list, use exactly three bullet points (no more). 
– Never write “(shortened)” or truncate yourself—be concise up front. 
– Reference the user’s actual data when available (e.g., “Last month you spent \$500 on dining”). 
– Speak in a friendly, professional tone. 
– Only expand beyond three sentences if the user explicitly says “More detail, please.”

      ${context}
      `;

      // Gemini expects a single text part
      const prompt = `${systemPrompt}\n${userMessage}`;

      const response = await axios.post<GeminiResponse>(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250,
            topP: 0.8,
            topK: 40
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      // Extract the response text and post-process for conciseness
      if (response.data.candidates && response.data.candidates.length > 0) {
        let text = response.data.candidates[0].content.parts[0].text;
        // Truncate to 250 chars
        if (text.length > 250) {
          text = text.slice(0, 250) + '… (shortened)';
        }
        return text;
      } else {
        throw new Error('No response from Gemini API');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error calling Gemini API:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        message: axiosError.message
      });

      // If it's a 503 error, retry with exponential backoff
      if (axiosError.response?.status === 503) {
        retryCount++;
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }

      // For other errors or if we've exhausted retries, return backup mode
      return '__BACKUP_MODE__';
    }
  }

  return '__BACKUP_MODE__';
}

/**
 * Mock implementation for development and testing
 * This simulates responses without calling the actual API
 */
export async function mockSendMessageToGemini(userMessage: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const message = userMessage.toLowerCase();
  
  // Generate different responses based on user's message content
  if (message.includes('budget') || message.includes('spending')) {
    return "Based on your recent spending patterns, I notice your restaurant expenses have increased by 23% compared to last month. You've spent $427 on dining out, which is $98 above your monthly budget for this category. Would you like some suggestions for reducing this spending?";
  } 
  else if (message.includes('invest') || message.includes('stock') || message.includes('market')) {
    return "Looking at your investment portfolio, I see you're currently allocated 65% in stocks, 25% in bonds, and 10% in cash. Given your financial goals and risk profile, you might want to consider increasing your exposure to ETFs, particularly those focused on emerging technologies. Your tech stocks have outperformed other sectors by 8.3% this quarter.";
  }
  else if (message.includes('save') || message.includes('saving')) {
    return "You're currently saving about 12% of your monthly income. That's good, but based on your goal to purchase a home in the next 3 years, I'd recommend increasing this to 18-20%. I've analyzed your spending and identified potential savings of $215 monthly by optimizing your subscription services and renegotiating your insurance rates.";
  }
  else if (message.includes('debt') || message.includes('loan') || message.includes('credit')) {
    return "I see you have a credit card balance of $3,245 with an APR of 19.99%. If you increase your monthly payment from $150 to $300, you could be debt-free in 11 months instead of 27 months, and save approximately $487 in interest charges. Would you like me to create a detailed debt repayment plan?";
  }
  else if (message.includes('retirement') || message.includes('401k') || message.includes('ira')) {
    return "Based on your current retirement contributions of $450/month and projected growth rate of 7%, you're on track to accumulate approximately $920,000 by age 65. This would provide estimated monthly income of $3,680. To reach your stated goal of $5,000 monthly retirement income, consider increasing your contributions by $275/month or adjusting your investment mix for potentially higher returns.";
  }
  else {
    return "Thank you for your message. Based on your overall financial situation, you're making good progress toward your goals. Your savings rate is above average, and your investment allocation aligns well with your risk profile. Is there a specific aspect of your finances you'd like me to analyze in more detail? I can help with budgeting, investment strategies, debt management, retirement planning, or tax optimization.";
  }
}
