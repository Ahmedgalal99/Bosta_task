import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";
import type { Product } from "../types";
import { Button, Confetti } from "./ui";
import { useCartStore } from "../stores/cartStore";
import { useWishlistStore } from "../stores/wishlistStore";
import { useToastStore } from "../stores/toastStore";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
    addToast("Added to cart!", "cart");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 400);
    const added = toggleItem(product);
    addToast(
      added ? "Added to wishlist!" : "Removed from wishlist",
      "wishlist"
    );
  };

  return (
    <div className="product-card group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full animate-slide-up relative">
      <Confetti active={showConfetti} />

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`heart-button absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md ${
          isHeartAnimating ? "animate-heart-pop" : ""
        }`}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            inWishlist
              ? "fill-pink-500 text-pink-500"
              : "text-gray-400 hover:text-pink-500"
          }`}
        />
      </button>

      <Link to={`/products/${product.id}`} className="block overflow-hidden">
        <div className="h-48 p-4 bg-gray-50 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="product-card-image max-h-full max-w-full object-contain"
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col grow">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[#E30613] uppercase tracking-wide font-semibold">
            {product.category}
          </span>
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-500">
                {product.rating.rate}
              </span>
            </div>
          )}
        </div>
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
            className="flex items-center gap-1 group/cart"
          >
            <ShoppingCart className="h-4 w-4 group-hover/cart:scale-110 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
