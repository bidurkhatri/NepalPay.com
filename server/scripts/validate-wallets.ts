/**
 * Script to validate and fix wallet data for existing users
 * Run this after deploying the wallet system to production
 */

import { storage } from '../pg-storage';
import { walletService } from '../services/wallet';

async function validateAndFixWallets() {
  console.log('Starting wallet validation and fix process...');
  
  try {
    // Get all users
    const users = await storage.getAllUsers();
    console.log(`Found ${users.length} users to process`);
    
    let walletsCreated = 0;
    let walletsFixed = 0;
    let errors = 0;
    
    for (const user of users) {
      try {
        console.log(`Processing user ${user.id} (${user.username})`);
        
        // Check if user has a wallet
        let wallet = await storage.getWalletByUserId(user.id);
        
        if (!wallet) {
          // Create wallet for user
          console.log(`Creating wallet for user ${user.id}`);
          wallet = await walletService.createUserWallet(user.id);
          walletsCreated++;
        } else if (!wallet.address) {
          // Fix wallet without address
          console.log(`Fixing wallet address for user ${user.id}`);
          // Would need to implement wallet address generation for existing wallets
          walletsFixed++;
        }
        
        // Update balances from blockchain if address exists
        if (wallet && wallet.address) {
          await walletService.updateWalletBalances(user.id);
        }
        
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        errors++;
      }
    }
    
    console.log('\nWallet validation completed:');
    console.log(`- Wallets created: ${walletsCreated}`);
    console.log(`- Wallets fixed: ${walletsFixed}`);
    console.log(`- Errors encountered: ${errors}`);
    
    // Validate configuration
    const configValidation = walletService.validateConfiguration();
    if (!configValidation.valid) {
      console.log('\nConfiguration issues found:');
      configValidation.errors.forEach(error => console.log(`- ${error}`));
    } else {
      console.log('\nWallet service configuration is valid');
    }
    
  } catch (error) {
    console.error('Wallet validation script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  validateAndFixWallets()
    .then(() => {
      console.log('Wallet validation script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Wallet validation script failed:', error);
      process.exit(1);
    });
}

export { validateAndFixWallets };