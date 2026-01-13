import { useState, useEffect, useMemo } from "react";
import { productService } from "../services/api";
import type { Product, SortOption } from "../types";
import { ProductCard, Pagination } from "../components";
import { Loading, ErrorMessage, EmptyState, Select } from "../components/ui";

const PRODUCTS_PER_PAGE = 10;

export function ProductListingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption | "">("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        productService.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (categoryFilter) {
      result = result.filter((product) => product.category === categoryFilter);
    }

    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "category") {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    return result;
  }, [products, sortOption, categoryFilter]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );
  }, [filteredAndSortedProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption, categoryFilter]);

  const sortOptions = [
    { value: "", label: "Default sorting" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "category", label: "Sort by Category" },
  ];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((cat) => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    })),
  ];

  if (isLoading) {
    return <Loading message="Loading products..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600">
          Discover our collection of {products.length} amazing products
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-48">
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={sortOptions}
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption | "")}
            aria-label="Sort products"
          />
        </div>
        <div className="flex items-center text-sm text-gray-500 ml-auto">
          Showing {paginatedProducts.length} of{" "}
          {filteredAndSortedProducts.length} products
        </div>
      </div>

      {paginatedProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try changing your filters to see more products."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
