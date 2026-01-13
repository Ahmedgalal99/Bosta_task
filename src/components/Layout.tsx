import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { ToastContainer } from "./ui";
import { useToastStore } from "../stores/toastStore";

export function Layout() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2026 Bosta Store
          </p>
        </div>
      </footer>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
