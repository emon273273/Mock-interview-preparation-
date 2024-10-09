"use client"
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

function Header() {

    const path=usePathname()
  return (
    <div className="flex p-4 items-center justify-between shadow-md ">
      <Image src={"./logo.svg"} width={16} height={10} />
      <ul className="hidden md:flex gap-6">
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path==="/dashboard"&&'text-primary font-bold'}`}>
          Dashboard
        </li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path==="/dashboard/questions"&&'text-primary font-bold'}`}>
          Questions
        </li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path==="/dashboard/upgrade"&&'text-primary font-bold'}`}>
          upgrade
        </li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path==="/dashboard/works"&&'text-primary font-bold'}`}>
          How its works?
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
