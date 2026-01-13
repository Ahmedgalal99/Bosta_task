import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { productService } from "../services/api";
import type { CreateProductData } from "../types";
import { Button, Input, Textarea, Select, Loading } from "../components/ui";

interface FormErrors {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  image?: string;
}

export function CreateProductPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<CreateProductData>({
    title: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, category: data[0] }));
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await productService.create(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      setFormData({
        title: "",
        description: "",
        price: 0,
        category: categories[0] || "",
        image: "",
      });
      setErrors({});
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to create product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isLoadingCategories) {
    return <Loading message="Loading form..." />;
  }

  const categoryOptions = categories.map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
  }));

  return (
    <div className="max-w-2xl mx-auto">
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 ">
          <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
          <div>
            <p className="font-semibold text-green-800">
              Product Created Successfully!
            </p>
            <p className="text-sm text-green-600">
              Your product has been added to the store.
            </p>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Create New Product
      </h1>
      <p className="text-gray-600 mb-8">
        Fill in the details to add a new product to the store.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 lg:p-8 space-y-6"
      >
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter product title"
          error={errors.title}
          required
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter product description"
          error={errors.description}
          required
        />

        <div className="grid sm:grid-cols-2 gap-6">
          <Input
            label="Price ($)"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price || ""}
            onChange={handleInputChange}
            placeholder="0.00"
            error={errors.price}
            required
          />

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            options={categoryOptions}
            error={errors.category}
            required
          />
        </div>

        <Input
          label="Image URL"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleInputChange}
          placeholder="https://example.com/image.jpg"
          error={errors.image}
          required
        />

        {formData.image && isValidUrl(formData.image) && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
            <img
              src={formData.image}
              alt="Preview"
              className="max-h-48 object-contain mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {submitError}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/")}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="flex-1"
          >
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}
