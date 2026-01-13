import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { Product } from "../types";
import { Button } from "./ui";
import { useCartStore } from "../stores/cartStore";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link to={`/products/${product.id}`} className="block">
        <div className="h-48 p-4 bg-gray-50 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col grow">
        <span className="text-xs text-[#E30613] uppercase tracking-wide font-semibold mb-1">
          {product.category}
        </span>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#E30613] transition-colors mb-2">
            {product.title}
          </h3>
        </Link>
        <p className="text-lg font-bold text-gray-900 mt-auto mb-3">
          ${product.price.toFixed(2)}
        </p>
        <div className="flex gap-2">
          <Link to={`/products/${product.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            className="flex items-center gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
