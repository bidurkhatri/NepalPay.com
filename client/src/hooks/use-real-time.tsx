import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { Transaction, Wallet, Collateral, Loan, Activity } from '@/types';

type RealtimeData = {
  wallet: Wallet | null;
  recentTransactions: Transaction[];
  collaterals: Collateral[];
  loans: Loan[];
  recentActivities: Activity[];
};

type RealtimeHook = {
  isConnected: boolean;
  data: RealtimeData;
  lastUpdate: Date | null;
  refreshData: () => void;
};

export function useRealTime(): RealtimeHook {
  const { user } = useAuth();
  const { toast } = useToast();
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [data, setData] = useState<RealtimeData>({
    wallet: null,
    recentTransactions: [],
    collaterals: [],
    loans: [],
    recentActivities: []
  });

  const connectWebSocket = useCallback(() => {
    // Close existing connection if any
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }

    // Skip if no user
    if (!user) return;

    // Create WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    // Set up event handlers
    socket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      
      // Authenticate the connection with user ID
      socket.send(JSON.stringify({
        type: 'auth',
        userId: user.id
      }));
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      
      // Try to reconnect after 5 seconds
      setTimeout(() => {
        if (user) connectWebSocket();
      }, 5000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to real-time updates',
        variant: 'destructive'
      });
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'connected':
            console.log('Connection confirmed');
            break;
            
          case 'userData':
            // Initial data load or refresh
            setData({
              wallet: message.wallet || null,
              recentTransactions: message.recentTransactions || [],
              collaterals: message.collaterals || [],
              loans: message.loans || [],
              recentActivities: message.recentActivities || []
            });
            setLastUpdate(new Date());
            break;
            
          case 'transaction':
            // Add new transaction to the list
            setData(prev => ({
              ...prev,
              recentTransactions: [
                message.transaction,
                ...prev.recentTransactions
              ].slice(0, 5) // Keep only the 5 most recent
            }));
            setLastUpdate(new Date());
            
            // Show notification
            toast({
              title: message.action === 'sent' ? 'Transaction Sent' : 'Transaction Received',
              description: `${message.transaction.amount} ${message.transaction.currency} ${message.action}`,
              variant: message.action === 'sent' ? 'default' : 'default'
            });
            break;
            
          case 'walletUpdate':
            // Update wallet information
            setData(prev => ({
              ...prev,
              wallet: message.wallet
            }));
            setLastUpdate(new Date());
            break;
            
          case 'collateralUpdate':
            // Update collateral list
            setData(prev => {
              const existingIndex = prev.collaterals.findIndex(c => c.id === message.collateral.id);
              
              if (existingIndex >= 0) {
                // Update existing collateral
                const updatedCollaterals = [...prev.collaterals];
                updatedCollaterals[existingIndex] = message.collateral;
                return {
                  ...prev,
                  collaterals: updatedCollaterals
                };
              } else {
                // Add new collateral
                return {
                  ...prev,
                  collaterals: [message.collateral, ...prev.collaterals]
                };
              }
            });
            setLastUpdate(new Date());
            
            toast({
              title: 'Collateral Updated',
              description: `Collateral status: ${message.collateral.status}`,
              variant: 'default'
            });
            break;
            
          case 'loanUpdate':
            // Update loan list
            setData(prev => {
              const existingIndex = prev.loans.findIndex(l => l.id === message.loan.id);
              
              if (existingIndex >= 0) {
                // Update existing loan
                const updatedLoans = [...prev.loans];
                updatedLoans[existingIndex] = message.loan;
                return {
                  ...prev,
                  loans: updatedLoans
                };
              } else {
                // Add new loan
                return {
                  ...prev,
                  loans: [message.loan, ...prev.loans]
                };
              }
            });
            setLastUpdate(new Date());
            
            toast({
              title: 'Loan Updated',
              description: `Loan status: ${message.loan.status}`,
              variant: 'default'
            });
            break;
            
          case 'activityUpdate':
            // Update activity list
            setData(prev => ({
              ...prev,
              recentActivities: message.recentActivities || []
            }));
            setLastUpdate(new Date());
            break;
            
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    // Store the socket reference
    socketRef.current = socket;
    
    // Clean up function
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [user, toast]);

  // Connect when component mounts or user changes
  useEffect(() => {
    if (user) {
      try {
        connectWebSocket();
      } catch (error) {
        console.error('Error connecting WebSocket:', error);
        toast({
          title: 'Connection Error',
          description: 'Failed to establish real-time connection. Will retry automatically.',
          variant: 'destructive'
        });
        
        // Try to reconnect after a short delay
        const reconnectTimer = setTimeout(() => {
          if (user) {
            try {
              connectWebSocket();
            } catch (reconnectError) {
              console.error('Error reconnecting WebSocket:', reconnectError);
            }
          }
        }, 3000);
        
        return () => clearTimeout(reconnectTimer);
      }
    } else {
      // Reset data when user logs out
      setData({
        wallet: null,
        recentTransactions: [],
        collaterals: [],
        loans: [],
        recentActivities: []
      });
      setIsConnected(false);
      setLastUpdate(null);
      
      // Close connection if exists
      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch (error) {
          console.error('Error closing WebSocket:', error);
        }
        socketRef.current = null;
      }
    }
    
    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch (error) {
          console.error('Error closing WebSocket on unmount:', error);
        }
        socketRef.current = null;
      }
    };
  }, [user, connectWebSocket, toast]);

  // Function to manually refresh data
  const refreshData = useCallback(() => {
    if (!user) {
      return;
    }
    
    try {
      // Check if the socket is open and ready
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'requestData',
          userId: user.id
        }));
      } else {
        // If socket is not connected, try to reconnect
        connectWebSocket();
        
        // Set a small timeout to give the socket time to connect before sending the request
        setTimeout(() => {
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
              type: 'requestData',
              userId: user.id
            }));
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: 'Refresh Failed',
        description: 'Unable to refresh data. Please try again.',
        variant: 'destructive'
      });
    }
  }, [user, connectWebSocket, toast]);

  return {
    isConnected,
    data,
    lastUpdate,
    refreshData
  };
}