import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "../stores/cartStore";
import { Button, EmptyState } from "../components/ui";

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } =
    useCartStore();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added any products yet."
          icon={<ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />}
        />
        <Link to="/">
          <Button variant="primary" className="mt-6">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={clearCart}
          className="text-red-600 hover:text-red-700"
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 flex gap-4"
            >
              <Link to={`/products/${item.id}`} className="shrink-0">
                <div className="w-24 h-24 bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-[#E30613] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                <p className="font-bold text-gray-900 mt-2">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate pr-2">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full mt-6">
              Proceed to Checkout
            </Button>

            <Link to="/" className="block mt-4">
              <Button variant="ghost" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
