import { useEffect } from "react";
import VendorSidebar from "../components/vendor/VendorSidebar";
import VendorTopbar from "../components/vendor/VendorTopbar";

export default function VendorLayout({ children, title }) {
  useEffect(() => {
    document.body.classList.add("vendor-dashboard-active");
    return () => document.body.classList.remove("vendor-dashboard-active");
  }, []);

  return (
    <div className="vendor-wrapper flex min-h-screen overflow-auto">

      <VendorSidebar />

      <div className="flex flex-col flex-1">

        <VendorTopbar title={title} />

        <main className="vendor-content flex-1 px-6 py-10">
          {children}
        </main>

      </div>
    </div>
  );
}
