import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, ProtectedRoute } from "./components";
import {
  ProductListingPage,
  ProductDetailsPage,
  CreateProductPage,
  CartPage,
  LoginPage,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProductListingPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route
            path="products/create"
            element={
              <ProtectedRoute>
                <CreateProductPage />
              </ProtectedRoute>
            }
          />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
