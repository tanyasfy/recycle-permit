// src/router/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { StartPage } from "../pages/StartPage";
import Impressum from "../pages/Impressum";
import Datenschutz from "../pages/Datenschutz";
import Kontakt from "../pages/Kontakt";
import ErrorPage from "../pages/ErrorPage";
import { PermitPage } from "../pages/PermitPage";
import { MyPermitsPage } from "../pages/MyPermitsPage";
import { EditPermitPage } from "../pages/EditPermitPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { PermitDetailPage } from "../pages/PermitDetailPage";
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <StartPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/permit/new",
            element: <PermitPage />,
          },
          {
            path: "/permits",
            element: <MyPermitsPage />,
          },
          {
            path: "/permit/:id",
            element: <PermitDetailPage />,
          },
          {
            path: "/permit/:id/edit",
            element: <EditPermitPage />,
          },
        ],
      },
      {
        path: "/impressum",
        element: <Impressum />,
      },
      {
        path: "/datenschutz",
        element: <Datenschutz />,
      },
      {
        path: "/kontakt",
        element: <Kontakt />,
      },
    ],
  },
]);
