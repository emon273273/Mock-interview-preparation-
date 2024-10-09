import { UserButton } from "@clerk/nextjs";
import React from "react";

function Dashboard() {
  return <div className="bg-gray-200 flex w-full my-auto justify-between items-end">
    <div>Dashboard</div>

    <UserButton className="my-auto "/>
  </div>;

}

export default Dashboard;
