
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "./context/CartContext";
import { CustomerProvider } from "./context/CustomerContext";
import { CategoryProvider } from "./context/CategoryContext";

import Router from "./lib/router";

const App = () => (

  <TooltipProvider>
    <Toaster />
    <Sonner position="top-right" />

    <CartProvider>
      <CustomerProvider>
        <CategoryProvider>
          <Router />
        </CategoryProvider>
      </CustomerProvider>
    </CartProvider>

  </TooltipProvider>

);

export default App;
