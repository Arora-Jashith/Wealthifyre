import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { useFinanceStore } from '@/store/finance-store';

/**
 * Generates a PDF report based on the specified type and data
 * @param reportType The type of report to generate
 * @returns Promise with the file URI if successful
 */
export async function generatePdfReport(reportType: string): Promise<string | null> {
  try {
    // Get data from the finance store
    const { accounts, transactions, investments, forecast } = useFinanceStore.getState();
    
    if (!accounts || !transactions || !investments || !forecast) {
      throw new Error('Required financial data is missing');
    }
    
    // Create a temporary HTML file that will be converted to PDF
    const htmlContent = generateReportHtml(reportType, { accounts, transactions, investments, forecast });
    
    // Save the HTML to a temporary file
    const htmlFilePath = `${FileSystem.cacheDirectory}report.html`;
    await FileSystem.writeAsStringAsync(htmlFilePath, htmlContent);
    
    // Create a filename based on report type and date
    const date = new Date().toISOString().split('T')[0];
    const filename = `${reportType.toLowerCase().replace(/\s+/g, '-')}-report-${date}.html`;
    const pdfFilePath = `${FileSystem.documentDirectory}${filename}`;
    
    // Copy the HTML file to the documents directory with the PDF name
    await FileSystem.copyAsync({
      from: htmlFilePath,
      to: pdfFilePath
    });
    
    // Clean up the temporary HTML file
    await FileSystem.deleteAsync(htmlFilePath, { idempotent: true });
    
    return pdfFilePath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * Shares a generated PDF file
 * @param fileUri The URI of the file to share
 */
export async function sharePdfReport(fileUri: string): Promise<void> {
  try {
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (!isAvailable) {
      throw new Error('Sharing is not available on this device');
    }
    
    // Check if the file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error('Report file not found');
    }
    
    await Sharing.shareAsync(fileUri);
  } catch (error) {
    console.error('Error sharing PDF:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * Generates HTML content for the report
 * @param reportType The type of report
 * @param data The financial data to include in the report
 * @returns HTML string
 */
function generateReportHtml(reportType: string, data: any): string {
  const { accounts, transactions, investments, forecast } = data;
  
  // Get current date in a nice format
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Common HTML header and styling
  const htmlHeader = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${reportType} Report</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #000000;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          color: white;
          padding: 20px;
          border-radius: 10px;
        }
        .logo {
          color: #ffffff;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        h1 {
          color: #ffffff;
          margin-top: 10px;
          font-size: 24px;
        }
        .date {
          color: #ffffff;
          font-style: italic;
          margin-top: 5px;
          opacity: 0.8;
        }
        .section {
          margin-bottom: 30px;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border: 1px solid #e0e0e0;
        }
        h2 {
          color: #000000;
          border-bottom: 2px solid #000000;
          padding-bottom: 10px;
          margin-bottom: 20px;
          font-size: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          background: white;
        }
        th, td {
          padding: 12px 15px;
          border-bottom: 1px solid #e0e0e0;
          text-align: left;
        }
        th {
          background-color: #f8f8f8;
          font-weight: 600;
          color: #000000;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
        .positive {
          color: #000000;
          font-weight: 600;
        }
        .negative {
          color: #666666;
          font-weight: 600;
        }
        .summary-box {
          background: linear-gradient(135deg, #f8f8f8 0%, #ffffff 100%);
          border-left: 4px solid #000000;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #ffffff;
          font-size: 14px;
          border-top: 2px solid #000000;
          padding-top: 20px;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          padding: 20px;
          border-radius: 10px;
        }
        .chart-container {
          margin: 20px 0;
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border: 1px solid #e0e0e0;
        }
        .category-tag {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          margin-right: 8px;
          background-color: #f0f0f0;
          color: #000000;
          border: 1px solid #e0e0e0;
        }
        .amount {
          font-family: 'Courier New', monospace;
          font-weight: 600;
        }
        strong {
          color: #000000;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Wealthifyre</div>
        <h1>${reportType} Report</h1>
        <div class="date">Generated on ${currentDate}</div>
      </div>
  `;
  
  // Common HTML footer
  const htmlFooter = `
      <div class="footer">
        <p>This report was generated by Wealthifyre CFO.</p>
        <p>For questions or assistance, please contact support@wealthifyre.com</p>
      </div>
    </body>
    </html>
  `;
  
  // Generate report content based on type
  let reportContent = '';
  
  switch (reportType.toLowerCase()) {
    case 'expense':
    case 'spending':
      reportContent = generateExpenseReportContent(transactions);
      break;
    case 'investment':
    case 'portfolio':
      reportContent = generateInvestmentReportContent(investments);
      break;
    case 'account':
    case 'summary':
    default:
      reportContent = generateSummaryReportContent(accounts, transactions, investments);
      break;
  }
  
  return htmlHeader + reportContent + htmlFooter;
}

/**
 * Generates content for an expense/spending report
 */
function generateExpenseReportContent(transactions: any[]): string {
  // Filter to only expense transactions
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  expenses.forEach(expense => {
    const category = expense.category || 'Uncategorized';
    if (!expensesByCategory[category]) {
      expensesByCategory[category] = 0;
    }
    expensesByCategory[category] += Math.abs(expense.amount);
  });
  
  // Sort categories by amount (highest first)
  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([, amountA], [, amountB]) => amountB - amountA);
  
  // Generate the HTML content
  let content = `
    <div class="section">
      <div class="summary-box">
        <h2>Expense Summary</h2>
        <p>Total expenses: <strong>$${totalExpenses.toFixed(2)}</strong></p>
        <p>Number of transactions: <strong>${expenses.length}</strong></p>
      </div>
    </div>
    
    <div class="section">
      <h2>Expenses by Category</h2>
      <table>
        <tr>
          <th>Category</th>
          <th>Amount</th>
          <th>Percentage</th>
        </tr>
  `;
  
  sortedCategories.forEach(([category, amount]) => {
    const percentage = (amount / totalExpenses * 100).toFixed(1);
    content += `
      <tr>
        <td>${category}</td>
        <td>$${amount.toFixed(2)}</td>
        <td>${percentage}%</td>
      </tr>
    `;
  });
  
  content += `
      </table>
    </div>
    
    <div class="section">
      <h2>Recent Transactions</h2>
      <table>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
        </tr>
  `;
  
  // Show the 10 most recent expenses
  expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)
    .forEach(expense => {
      content += `
        <tr>
          <td>${new Date(expense.date).toLocaleDateString()}</td>
          <td>${expense.description}</td>
          <td>${expense.category || 'Uncategorized'}</td>
          <td class="negative">-$${Math.abs(expense.amount).toFixed(2)}</td>
        </tr>
      `;
    });
  
  content += `
      </table>
    </div>
  `;
  
  return content;
}

/**
 * Generates content for an investment/portfolio report
 */
function generateInvestmentReportContent(investments: any[]): string {
  // Calculate total investment value
  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0);
  
  // Calculate total cost basis
  const totalCost = investments.reduce((sum, inv) => sum + inv.costBasis, 0);
  
  // Calculate total gain/loss
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = (totalGainLoss / totalCost * 100).toFixed(2);
  
  // Generate the HTML content
  let content = `
    <div class="section">
      <div class="summary-box">
        <h2>Investment Summary</h2>
        <p>Total portfolio value: <strong>$${totalValue.toFixed(2)}</strong></p>
        <p>Total cost basis: <strong>$${totalCost.toFixed(2)}</strong></p>
        <p>Total gain/loss: <strong class="${totalGainLoss >= 0 ? 'positive' : 'negative'}">
          ${totalGainLoss >= 0 ? '+' : ''}$${totalGainLoss.toFixed(2)} (${totalGainLoss >= 0 ? '+' : ''}${totalGainLossPercent}%)
        </strong></p>
      </div>
    </div>
    
    <div class="section">
      <h2>Investment Holdings</h2>
      <table>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Shares</th>
          <th>Current Price</th>
          <th>Value</th>
          <th>Gain/Loss</th>
        </tr>
  `;
  
  // Sort investments by value (highest first)
  investments
    .sort((a, b) => b.value - a.value)
    .forEach(investment => {
      const gainLoss = investment.value - investment.costBasis;
      const gainLossPercent = (gainLoss / investment.costBasis * 100).toFixed(2);
      
      content += `
        <tr>
          <td>${investment.symbol}</td>
          <td>${investment.name}</td>
          <td>${investment.shares}</td>
          <td>$${(investment.value / investment.shares).toFixed(2)}</td>
          <td>$${investment.value.toFixed(2)}</td>
          <td class="${gainLoss >= 0 ? 'positive' : 'negative'}">
            ${gainLoss >= 0 ? '+' : ''}$${gainLoss.toFixed(2)} (${gainLoss >= 0 ? '+' : ''}${gainLossPercent}%)
          </td>
        </tr>
      `;
    });
  
  content += `
      </table>
    </div>
  `;
  
  return content;
}

/**
 * Generates content for a summary report
 */
function generateSummaryReportContent(accounts: any[], transactions: any[], investments: any[]): string {
  // Calculate account totals
  const totalAssets = accounts
    .filter(account => account.type !== 'credit')
    .reduce((sum, account) => sum + account.balance, 0);
  
  const totalLiabilities = accounts
    .filter(account => account.type === 'credit')
    .reduce((sum, account) => sum + Math.abs(account.balance), 0);
  
  const netWorth = totalAssets - totalLiabilities;
  
  // Calculate income and expenses
  const recentTransactions = transactions.slice(0, 30); // Last 30 transactions
  const income = recentTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = recentTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const cashFlow = income - expenses;
  
  // Calculate investment value
  const investmentValue = investments.reduce((sum, inv) => sum + inv.value, 0);
  
  // Generate the HTML content
  let content = `
    <div class="section">
      <div class="summary-box">
        <h2>Financial Summary</h2>
        <p>Net Worth: <strong>$${netWorth.toFixed(2)}</strong></p>
        <p>Total Assets: <strong>$${totalAssets.toFixed(2)}</strong></p>
        <p>Total Liabilities: <strong>$${totalLiabilities.toFixed(2)}</strong></p>
        <p>Monthly Cash Flow: <strong class="${cashFlow >= 0 ? 'positive' : 'negative'}">
          ${cashFlow >= 0 ? '+' : ''}$${cashFlow.toFixed(2)}
        </strong></p>
      </div>
    </div>
    
    <div class="section">
      <h2>Account Summary</h2>
      <table>
        <tr>
          <th>Account</th>
          <th>Type</th>
          <th>Balance</th>
        </tr>
  `;
  
  // Sort accounts by balance (highest first)
  accounts
    .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
    .forEach(account => {
      content += `
        <tr>
          <td>${account.name}</td>
          <td>${account.type}</td>
          <td class="${account.type !== 'credit' ? 'positive' : 'negative'}">
            ${account.type !== 'credit' ? '' : '-'}$${Math.abs(account.balance).toFixed(2)}
          </td>
        </tr>
      `;
    });
  
  content += `
      </table>
    </div>
    
    <div class="section">
      <h2>Income & Expenses</h2>
      <table>
        <tr>
          <th>Category</th>
          <th>Amount</th>
        </tr>
        <tr>
          <td>Income</td>
          <td class="positive">$${income.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Expenses</td>
          <td class="negative">-$${expenses.toFixed(2)}</td>
        </tr>
        <tr>
          <td><strong>Net Cash Flow</strong></td>
          <td class="${cashFlow >= 0 ? 'positive' : 'negative'}">
            ${cashFlow >= 0 ? '+' : ''}$${cashFlow.toFixed(2)}
          </td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <h2>Investment Overview</h2>
      <p>Total Investment Value: <strong>$${investmentValue.toFixed(2)}</strong></p>
      <p>Asset Allocation:</p>
      <table>
        <tr>
          <th>Asset Class</th>
          <th>Value</th>
          <th>Allocation</th>
        </tr>
  `;
  
  // Group investments by asset class
  const assetClasses: Record<string, number> = {};
  investments.forEach(inv => {
    const assetClass = inv.assetClass || 'Other';
    if (!assetClasses[assetClass]) {
      assetClasses[assetClass] = 0;
    }
    assetClasses[assetClass] += inv.value;
  });
  
  // Sort asset classes by value (highest first)
  Object.entries(assetClasses)
    .sort(([, valueA], [, valueB]) => valueB - valueA)
    .forEach(([assetClass, value]) => {
      const allocation = (value / investmentValue * 100).toFixed(1);
      content += `
        <tr>
          <td>${assetClass}</td>
          <td>$${value.toFixed(2)}</td>
          <td>${allocation}%</td>
        </tr>
      `;
    });
  
  content += `
      </table>
    </div>
  `;
  
  return content;
}
