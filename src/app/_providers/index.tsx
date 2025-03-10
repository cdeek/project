"use client";

import React from "react";
import { AuthProvider } from "./Auth";
import { CartProvider } from "./Cart";
import { ThemeProvider } from "./Theme"; 
import { Toaster } from '@/components/ui/toaster';

const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider
     attribute="class"
     defaultTheme="system"
     enableSystem
     disableTransitionOnChange
    >
      <AuthProvider>
        <CartProvider>
          {children} 
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>    
  ) 
} 

export default Providers;
