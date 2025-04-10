import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { useAuth } from '../hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface RealTimeContextType {
  wsStatus: WebSocketStatus;
  lastMessage: any | null;
  sendMessage: (data: any) => void;
}

export const RealTimeContext = createContext<RealTimeContextType | null>(null);

export const RealTimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setWsStatus('disconnected');
      return;
    }

    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        
        console.log(`Attempting to connect WebSocket to: ${wsUrl}`);
        setWsStatus('connecting');
        
        // Close existing connection if any
        if (wsRef.current) {
          wsRef.current.close();
        }
        
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('WebSocket connection established');
          setWsStatus('connected');
          toast({
            title: "Connected",
            description: "Real-time updates are now enabled",
            variant: "default",
          });
          
          // Send authentication message after connection
          if (user) {
            try {
              ws.send(JSON.stringify({
                type: 'auth',
                userId: user.id,
              }));
              console.log(`Authentication message sent for user ID: ${user.id}`);
            } catch (sendError) {
              console.error('Error sending authentication message:', sendError);
            }
          }
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setLastMessage(data);
            
            // Handle different message types
            switch (data.type) {
              case 'transaction_completed':
                toast({
                  title: "Transaction Completed",
                  description: "Your transaction has been processed successfully",
                  variant: "default",
                });
                break;
                
              case 'transaction_failed':
                toast({
                  title: "Transaction Failed",
                  description: data.data?.error || "Your transaction could not be processed",
                  variant: "destructive",
                });
                break;
                
              case 'loan_approved':
                toast({
                  title: "Loan Approved",
                  description: "Your loan application has been approved",
                  variant: "default",
                });
                break;
                
              case 'loan_rejected':
                toast({
                  title: "Loan Rejected",
                  description: data.data?.reason || "Your loan application was rejected",
                  variant: "destructive",
                });
                break;
                
              case 'collateral_locked':
                toast({
                  title: "Collateral Locked",
                  description: "Your collateral has been successfully locked",
                  variant: "default",
                });
                break;
                
              case 'price_update':
                // Silent update, no toast needed
                break;
                
              default:
                // Handle other message types
                break;
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setWsStatus('error');
          toast({
            title: "Connection Error",
            description: "Failed to connect to real-time updates",
            variant: "destructive",
          });
        };
        
        ws.onclose = () => {
          setWsStatus('disconnected');
          
          // Set up reconnection
          if (!reconnectTimerRef.current && user) {
            reconnectTimerRef.current = setTimeout(() => {
              reconnectTimerRef.current = null;
              if (user) connectWebSocket();
            }, 5000);
          }
        };
        
        wsRef.current = ws;
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
        setWsStatus('error');
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [user, toast]);

  // Send message function
  const sendMessage = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
      toast({
        title: "Connection Error",
        description: "Cannot send message: not connected to server",
        variant: "destructive",
      });
    }
  };

  return (
    <RealTimeContext.Provider value={{ wsStatus, lastMessage, sendMessage }}>
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};