import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import { productService } from "../services/api";
import type { Product } from "../types";
import { useCartStore } from "../stores/cartStore";
import { Button, Loading, ErrorMessage } from "../components/ui";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

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
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (isLoading) {
    return <Loading message="Loading product details..." />;
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
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
          <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-96 max-w-full object-contain"
            />
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
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating.rate}</span>
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
              <p className="text-3xl font-bold text-gray-900 mb-6">
                ${product.price.toFixed(2)}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addedToCart ? "Added to Cart!" : "Add to Cart"}
                </Button>
                <Link to="/cart">
                  <Button variant="secondary" size="lg" className="w-full">
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
