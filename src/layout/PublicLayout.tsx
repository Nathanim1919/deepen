import { Outlet } from "@tanstack/react-router";
import { Header } from "../pages/header";
import { Footer } from "../pages/footer";

export const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow ">
        <Outlet /> {/* Dynamically render child components */}
      </main>
      <Footer />
    </div>
  );
};
