import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/react-app/contexts/ThemeContext";
import { AuthProvider } from "@/react-app/contexts/AuthContext";
import PrivateRoute from "@/react-app/components/PrivateRoute";
import HomePage from "@/react-app/pages/Home";
import AboutPage from "@/react-app/pages/About";
import ServicesPage from "@/react-app/pages/Services";
import ServiceCategoryPage from "@/react-app/pages/ServiceCategory";
import ServiceDetailPage from "@/react-app/pages/ServiceDetail";
import BlogPage from "@/react-app/pages/Blog";
import BlogPostPage from "@/react-app/pages/BlogPost";
import ContactPage from "@/react-app/pages/Contact";
import AdminPage from "@/react-app/pages/Admin";
import AdminLoginPage from "@/react-app/pages/admin/Login";
import AdminPagesPage from "@/react-app/pages/admin/Pages";
import AdminBlogPage from "@/react-app/pages/admin/Blog";
import AdminServicesPage from "@/react-app/pages/admin/Services";
import AdminContactPage from "@/react-app/pages/admin/Contact";
import AdminSettingsPage from "@/react-app/pages/admin/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/hakkimizda",
    element: <AboutPage />
  },
  {
    path: "/hizmetler",
    element: <ServicesPage />
  },
  {
    path: "/hizmetler/:category",
    element: <ServiceCategoryPage />
  },
  {
    path: "/hizmet/:id",
    element: <ServiceDetailPage />
  },
  {
    path: "/blog",
    element: <BlogPage />
  },
  {
    path: "/blog/:slug",
    element: <BlogPostPage />
  },
  {
    path: "/iletisim",
    element: <ContactPage />
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />
  },
  {
    path: "/admin",
    element: <PrivateRoute><AdminPage /></PrivateRoute>
  },
  {
    path: "/admin/sayfalar",
    element: <PrivateRoute><AdminPagesPage /></PrivateRoute>
  },
  {
    path: "/admin/blog",
    element: <PrivateRoute><AdminBlogPage /></PrivateRoute>
  },
  {
    path: "/admin/hizmetler",
    element: <PrivateRoute><AdminServicesPage /></PrivateRoute>
  },
  {
    path: "/admin/iletisim",
    element: <PrivateRoute><AdminContactPage /></PrivateRoute>
  },
  {
    path: "/admin/ayarlar",
    element: <PrivateRoute><AdminSettingsPage /></PrivateRoute>
  }
]);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
