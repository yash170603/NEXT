"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  // const signOut = async() =>{
  //      del
  // }
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-600">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Mystery Message
        </a>
        {session ? (
          <>
            <span className="m-4 text-black">
              {" "}
              Welcome {user?.username} || {user?.email}{" "}
            </span>
            <Button onClick={() => signOut()} className="w-full md:w-auto">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href={"/sign-in"}>
              <Button className="w-full md:w-auto">Login</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
