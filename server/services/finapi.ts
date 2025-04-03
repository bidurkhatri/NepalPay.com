import axios from 'axios';
import CryptoJS from 'crypto-js';

// FinAPI Base URL (Sandbox)
const BASE_URL = process.env.FINAPI_BASE_URL || 'https://sandbox.api.finapi.io';

// Token storage
let token: string = '';
let tokenExpiry: number = 0;

/**
 * FinAPI Service for KYC and financial services integration
 */
export class FinAPIService {
  private clientId: string;
  private clientSecret: string;
  private decryptionKey: string;

  constructor() {
    this.clientId = process.env.FINAPI_CLIENT_ID || '';
    this.clientSecret = process.env.FINAPI_CLIENT_SECRET || '';
    this.decryptionKey = process.env.FINAPI_DECRYPTION_KEY || '';
    
    // Check for missing credentials and report detailed errors
    const missingEnvVars = [];
    if (!this.clientId) missingEnvVars.push('FINAPI_CLIENT_ID');
    if (!this.clientSecret) missingEnvVars.push('FINAPI_CLIENT_SECRET');
    if (!this.decryptionKey) missingEnvVars.push('FINAPI_DECRYPTION_KEY');
    
    if (missingEnvVars.length > 0) {
      console.error(`FinAPI credentials missing from environment variables: ${missingEnvVars.join(', ')}`);
    }
    
    // Log the base URL being used
    console.log(`Using FinAPI base URL: ${BASE_URL}`);
  }

  /**
   * Get or refresh the authentication token
   */
  private async getToken(): Promise<string> {
    // Check if token exists and is still valid
    if (token && tokenExpiry && tokenExpiry > Date.now()) {
      return token;
    }

    try {
      // Create URL-encoded form data for OAuth token request
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);

      console.log(`Requesting token from ${BASE_URL}/oauth/token`);
      
      const response = await axios.post(`${BASE_URL}/oauth/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const newToken: string = response.data.access_token;
      if (!newToken) {
        throw new Error('No token received from FinAPI');
      }
      
      token = newToken;
      // Set expiry time (usually 1 hour)
      tokenExpiry = Date.now() + ((response.data.expires_in - 60) * 1000);
      console.log('Successfully obtained FinAPI token');
      return token;
    } catch (error: any) {
      console.error('Error getting FinAPI token:', error);
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        console.error('FinAPI token error response:', {
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('FinAPI token no response received:', error.request);
      }
      throw new Error(`Failed to authenticate with FinAPI: ${error.message}`);
    }
  }

  /**
   * Create a new FinAPI user
   */
  async createUser(userId: number, email: string, phone: string): Promise<any> {
    try {
      console.log(`Creating FinAPI user for user ID ${userId} with email ${email}`);
      const token = await this.getToken();
      
      const userData = {
        id: `nepali-pay-user-${userId}`,
        email: email,
        phone: phone,
        isAutoUpdateEnabled: true
      };
      
      console.log(`Sending request to ${BASE_URL}/api/v1/users with data:`, userData);
      
      const response = await axios.post(`${BASE_URL}/api/v1/users`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('FinAPI user created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating FinAPI user:', error);
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        console.error('FinAPI error response:', {
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('FinAPI no response received:', error.request);
      }
      throw new Error(`Failed to create user in FinAPI: ${error.message}`);
    }
  }

  /**
   * Verify a user's identity (KYC process)
   */
  async initiateKycVerification(finApiUserId: string): Promise<any> {
    try {
      const token = await this.getToken();
      
      const response = await axios.post(`${BASE_URL}/api/v1/verifications/identity`, {
        userId: finApiUserId,
        callbackUrl: `${process.env.APP_URL || 'http://localhost:5000'}/api/finapi/callback`
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error initiating KYC verification:', error);
      throw new Error('Failed to initiate KYC verification');
    }
  }

  /**
   * Get KYC verification status
   */
  async getKycVerificationStatus(verificationId: string): Promise<any> {
    try {
      const token = await this.getToken();
      
      const response = await axios.get(`${BASE_URL}/api/v1/verifications/identity/${verificationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting KYC verification status:', error);
      throw new Error('Failed to get KYC verification status');
    }
  }

  /**
   * Import a bank connection
   */
  async importBankConnection(finApiUserId: string, bankId: string, credentials: any): Promise<any> {
    try {
      const token = await this.getToken();
      
      const response = await axios.post(`${BASE_URL}/api/v1/bankConnections/import`, {
        userId: finApiUserId,
        bankId: bankId,
        loginCredentials: credentials,
        storeSecrets: true
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error importing bank connection:', error);
      throw new Error('Failed to import bank connection');
    }
  }

  /**
   * Get bank accounts for a user
   */
  async getBankAccounts(finApiUserId: string): Promise<any> {
    try {
      const token = await this.getToken();
      
      const response = await axios.get(`${BASE_URL}/api/v1/accounts`, {
        params: {
          userId: finApiUserId
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting bank accounts:', error);
      throw new Error('Failed to get bank accounts');
    }
  }

  /**
   * Get bank account transactions
   */
  async getTransactions(finApiUserId: string, accountId: string, from?: string, to?: string): Promise<any> {
    try {
      const token = await this.getToken();
      
      const response = await axios.get(`${BASE_URL}/api/v1/transactions`, {
        params: {
          userId: finApiUserId,
          accountId: accountId,
          from: from,
          to: to
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw new Error('Failed to get transactions');
    }
  }

  /**
   * Decrypt sensitive data with the data decryption key
   */
  decryptSensitiveData(encryptedData: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.decryptionKey);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw new Error('Failed to decrypt sensitive data');
    }
  }
}

// Create a singleton instance
export const finAPIService = new FinAPIService();