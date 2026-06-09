import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { AuthModal } from "../../features/auth/AuthModal";
import { useState } from "react";

export function AppLayout() {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  return (
    <>
      <AppHeader setOpenAuthModal={setOpenAuthModal} />
      <AuthModal
        isOpen={openAuthModal}
        onClose={() => setOpenAuthModal(false)}
      />
      <Outlet />

      <AppFooter />
    </>
  );
}
