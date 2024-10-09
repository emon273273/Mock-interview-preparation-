import Header from "@/components/header";
import React from "react";

function DashboardLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default DashboardLayout;
