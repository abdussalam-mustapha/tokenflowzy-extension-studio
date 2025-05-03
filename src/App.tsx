import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import CreateToken from "./pages/CreateToken";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ZkCompression from "./pages/ZkCompression";
import CompressedWallet from "./pages/CompressedWallet";
import { WalletContextProvider } from "./lib/wallet/WalletContext";
import { ZkCompressionProvider } from "./lib/zk-compression/ZkCompressionContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletContextProvider>
        <ZkCompressionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="create" element={<CreateToken />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="zk-compression" element={<ZkCompression />} />
                <Route path="compressed-wallet" element={<CompressedWallet />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ZkCompressionProvider>
      </WalletContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
