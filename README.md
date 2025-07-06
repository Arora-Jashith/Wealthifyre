# Wealthifyre - AI Powered Personal Finance Mobile App

# A comprehensive personal finance application that combines intuitive design with powerful AI-driven insights to help you take control of your financial life.

https://github.com/user-attachments/assets/7dacc228-89a4-470a-8ecf-fd633f926cbb

## 🎯 **Project Overview**

Wealthifyre is a modern, mobile-first financial management platform that empowers users to:

- 📱 **Native mobile experience** with smooth, intuitive interactions
- 🤖 **Get AI-powered insights** from your personal CFO assistant
- 💡 **Make informed decisions** with predictive analytics
- 🔐 **Secure your data** with enterprise-grade encryption
- 🌐 **Cross-platform compatibility** with iOS and Android support

### ✨ **Key Capabilities**

- Real-time financial overview and account aggregation
- Smart transaction tracking with automatic categorization
- AI-driven budget recommendations and spending insights
- Investment portfolio management with round-up investing
- Personalized financial advice and goal tracking
- Native mobile performance with Expo's optimized runtime

---

## 🏗️ **What's Included**

### 📈 **Dashboard**
- **Real-time Overview**: Live financial metrics and account balances
- **Account Management**: Multi-bank integration and account linking
- **Quick Actions**: Instant transfers, payments, and budget adjustments
- **Smart Notifications**: Alerts for unusual spending and bill reminders

### 💳 **Transactions**
- **Intelligent Tracking**: Automatic transaction import and categorization
- **Advanced Filtering**: Search by date, amount, category, or merchant
- **Receipt Management**: Photo capture and digital storage
- **Fraud Detection**: AI-powered anomaly detection

### 📊 **Budgets**
- **Smart Creation**: AI-recommended budget categories and limits
- **Real-time Tracking**: Live spending updates and progress indicators
- **Period Management**: Weekly, monthly, and custom budget cycles
- **Predictive Analytics**: Spending forecasts and trend analysis

### 📈 **Investments**
- **Portfolio Management**: Real-time tracking of stocks, bonds, and crypto
- **Category Allocation**: Asset diversification monitoring
- **Round-up Investing**: Automatic micro-investing from spare change
- **Performance Analytics**: ROI tracking and market insights

### 🤖 **AI Assistant**
- **Personal CFO**: Conversational financial advisor
- **Smart Analysis**: Spending pattern recognition and insights
- **Goal Planning**: Personalized savings and investment strategies
- **Market Updates**: Real-time financial news and recommendations

### 💰 **Money Management**
- **Send Money**: Instant peer-to-peer transfers
- **Add Funds**: Multiple funding sources and payment methods
- **Investment Options**: Curated investment opportunities
- **Savings Goals**: Automated savings with progress tracking

---

## 🛠️ **Technical Setup**

### Prerequisites

Before getting started, ensure you have:

```bash
node >= 18.0.0
npm >= 9.0.0
expo-cli >= 6.0.0
git >= 2.0.0
```

**For Development:**
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) installed globally
- [Expo Go](https://expo.dev/client) app on your mobile device (for testing)
- iOS Simulator (macOS) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wealthifyre.git
   cd wealthifyre
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo CLI globally (if not already installed)**
   ```bash
   npm install -g @expo/cli
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Expo Configuration
   EXPO_PUBLIC_API_URL=https://api.wealthifyre.com
   
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/wealthifyre
   
   # Authentication
   EXPO_PUBLIC_AUTH_DOMAIN=wealthifyre.auth0.com
   EXPO_PUBLIC_AUTH_CLIENT_ID=your-auth0-client-id
   
   # AI Services
   OPENAI_API_KEY=your-openai-key
   
   # Financial APIs
   PLAID_CLIENT_ID=your-plaid-client-id
   PLAID_SECRET=your-plaid-secret
   PLAID_ENV=sandbox
   
   # Payment Processing
   STRIPE_SECRET_KEY=your-stripe-secret
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable
   
   # Push Notifications
   EXPO_PUSH_TOKEN=your-expo-push-token
   
   # External Services
   CLOUDINARY_URL=cloudinary://your-cloudinary-config
   ```

### Development Server

```bash
# Start Expo development server
npx expo start

# Start with specific platform
npx expo start --ios          # iOS simulator
npx expo start --android      # Android emulator
npx expo start --web          # Web browser

# Start with tunnel for device testing
npx expo start --tunnel

# Clear cache and start
npx expo start --clear
```

**Testing on Device:**
1. Install [Expo Go](https://expo.dev/client) on your mobile device
2. Scan the QR code displayed in terminal/browser
3. The app will load directly on your device

**Testing on Simulator:**
- **iOS**: Press `i` in the terminal to open iOS simulator
- **Android**: Press `a` in the terminal to open Android emulator
- **Web**: Press `w` in the terminal to open in web browser

### Platform Support

- **iOS**: iPhone 12+ (iOS 14+) - Native performance with React Native
- **Android**: Android 8.0+ (API level 26+) - Optimized for modern devices
- **Expo Go**: Development and testing on physical devices
- **Web**: Progressive Web App (PWA) capabilities via Expo for Web

---

## 🏗️ **Project Structure**

```
wealthifyre/
├── 📱 src/
│   ├── components/             # Reusable UI components
│   │   ├── ui/                # Base UI components
│   │   ├── forms/             # Form components
│   │   ├── charts/            # Financial charts
│   │   └── modals/            # Modal components
│   ├── screens/               # App screens/pages
│   │   ├── Dashboard/         # Dashboard screen
│   │   ├── Transactions/      # Transaction management
│   │   ├── Budgets/           # Budget tracking
│   │   ├── Investments/       # Investment portfolio
│   │   ├── AI/                # AI assistant
│   │   └── Auth/              # Authentication screens
│   ├── navigation/            # Navigation configuration
│   │   ├── AppNavigator.tsx   # Main app navigation
│   │   ├── AuthNavigator.tsx  # Auth flow navigation
│   │   └── TabNavigator.tsx   # Bottom tab navigation
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API services
│   │   ├── api.ts            # API client configuration
│   │   ├── auth.ts           # Authentication service
│   │   ├── plaid.ts          # Plaid integration
│   │   └── ai.ts             # AI service integration
│   ├── store/                 # State management
│   │   ├── slices/           # Redux Toolkit slices
│   │   └── store.ts          # Store configuration
│   ├── utils/                 # Utility functions
│   ├── constants/             # App constants
│   └── types/                 # TypeScript definitions
├── 📁 assets/
│   ├── images/               # Image assets
│   ├── icons/                # Icon files
│   └── fonts/                # Custom fonts
├── 📄 app.json               # Expo configuration
├── 📄 babel.config.js        # Babel configuration
├── 📄 metro.config.js        # Metro bundler config
└── 📄 tsconfig.json          # TypeScript configuration
```

### Component Architecture

```typescript
// Example React Native component structure
src/
├── components/
│   ├── ui/                     # Base components (Button, Input, Card)
│   ├── forms/                  # Form components (LoginForm, BudgetForm)
│   ├── charts/                 # Chart components (LineChart, PieChart)
│   └── modals/                 # Modal components (TransactionModal)
├── screens/                    # Screen components
├── hooks/                      # Custom hooks (useAuth, useTransactions)
├── services/                   # API and external services
└── utils/                      # Helper functions
```

### Navigation Structure

```typescript
// React Navigation v6 setup
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
```

### State Management

The application uses a modern React Native state management approach:

- **Redux Toolkit**: Global application state management
- **React Query**: Server state caching and synchronization
- **AsyncStorage**: Persistent local storage for user preferences
- **Context API**: Component-level state and theme management
- **Expo SecureStore**: Secure storage for sensitive data

### Service Integrations

- **Plaid**: Bank account connectivity and transaction data
- **Stripe**: Payment processing and card management
- **OpenAI**: AI-powered financial insights and advice
- **Expo Notifications**: Push notifications for alerts
- **Auth0**: Authentication and user management
- **Cloudinary**: Receipt and document storage

---




