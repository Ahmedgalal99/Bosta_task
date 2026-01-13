import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Plus } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { Button, BostaLogo } from "./ui";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, username, logout } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <BostaLogo className="h-8 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-[#E30613] transition-colors font-medium"
            >
              Products
            </Link>
            <Link
              to="/products/create"
              className="text-gray-600 hover:text-[#E30613] transition-colors font-medium flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Create Product
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-[#E30613] transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E30613] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm text-gray-600">
                  Hello, <span className="font-medium">{username}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
