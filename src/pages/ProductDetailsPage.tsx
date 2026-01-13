import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Heart } from "lucide-react";
import { productService } from "../services/api";
import type { Product } from "../types";
import { useCartStore } from "../stores/cartStore";
import { useWishlistStore } from "../stores/wishlistStore";
import { useToastStore } from "../stores/toastStore";
import {
  Button,
  ErrorMessage,
  ProductDetailsSkeleton,
  Confetti,
} from "../components/ui";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await productService.getById(parseInt(id));
        setProduct(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load product details."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 100);
      addToast("Added to cart!", "cart");
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      setIsHeartAnimating(true);
      setTimeout(() => setIsHeartAnimating(false), 400);
      const added = toggleItem(product);
      addToast(
        added ? "Added to wishlist!" : "Removed from wishlist",
        "wishlist"
      );
    }
  };

  const inWishlist = product ? isInWishlist(product.id) : false;

  if (isLoading) {
    return (
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  }

  if (!product) {
    return <ErrorMessage message="Product not found" />;
  }

  return (
    <div className="relative">
      <Confetti active={showConfetti} />

      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-slide-up">
        <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
          <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center relative group">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-96 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
            {/* Wishlist button on image */}
            <button
              onClick={handleToggleWishlist}
              className={`heart-button absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg ${
                isHeartAnimating ? "animate-heart-pop" : ""
              }`}
              aria-label={
                inWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart
                className={`h-6 w-6 transition-colors ${
                  inWishlist
                    ? "fill-pink-500 text-pink-500"
                    : "text-gray-400 hover:text-pink-500"
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-[#E30613] uppercase tracking-wide font-semibold mb-2">
              {product.category}
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.rating!.rate)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="font-medium ml-1">
                    {product.rating.rate}
                  </span>
                </div>
                <span className="text-gray-500">
                  ({product.rating.count} reviews)
                </span>
              </div>
            )}

            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="mt-auto">
              <p className="text-3xl font-bold gradient-text mb-6">
                ${product.price.toFixed(2)}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleToggleWishlist}
                  className={`flex items-center justify-center gap-2 ${
                    inWishlist ? "border-pink-500 text-pink-500" : ""
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${inWishlist ? "fill-pink-500" : ""}`}
                  />
                  {inWishlist ? "In Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              <Link to="/cart" className="block mt-4">
                <Button variant="ghost" className="w-full">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
