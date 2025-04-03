import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App";
import "./index.css";

// Import Inter font
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css"; 
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// Import Poppins font
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

// Import Roboto Mono font
import "@fontsource/roboto-mono/400.css";

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: "20px", 
          margin: "20px", 
          backgroundColor: "rgba(30, 35, 50, 0.8)",
          color: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
        }}>
          <h2 style={{ color: "#f43f5e" }}>Something went wrong.</h2>
          <details style={{ whiteSpace: "pre-wrap", marginTop: "10px", padding: "10px", backgroundColor: "rgba(0,0,0,0.2)" }}>
            <summary>See error details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>Component Stack:</p>
            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

// Add global error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

// Create root and render app
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

console.log("Mounting React app to root element...");

createRoot(rootElement).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
