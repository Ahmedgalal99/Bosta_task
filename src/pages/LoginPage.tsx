import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Button, Input, BostaLogo } from "../components/ui";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const from = location.state?.from?.pathname || "/";

  const validateForm = (): boolean => {
    const errors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      errors.username = "Username is required";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    const success = await login({ username, password });
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center mb-4">
            <BostaLogo className="h-10 w-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 lg:p-8 space-y-6"
        >
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            error={formErrors.username}
            autoComplete="username"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            error={formErrors.password}
            autoComplete="current-password"
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            Sign In
          </Button>

          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Demo credentials (from Fake Store API):</p>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              username: mor_2314 | password: 83r5^_
            </code>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link to="/" className="text-[#E30613] hover:underline">
            ← Back to Products
          </Link>
        </p>
      </div>
    </div>
  );
}
