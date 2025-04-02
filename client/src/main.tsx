import { createRoot } from "react-dom/client";
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

// Create root and render app
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(<App />);
