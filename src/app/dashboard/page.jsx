import AddNewInterview from "@/components/add-new-interview";
import Header from "@/components/header";
import { UserButton } from "@clerk/nextjs";
import React from "react";

function Dashboard() {
  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl">Dashboard</h2>
      <h2 className="text-gray-400">Create and start your Ai Mockup</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 my-5">
        <AddNewInterview/>
      </div>
    </div>
    
  );
}

export default Dashboard;
