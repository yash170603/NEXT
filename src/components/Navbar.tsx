// "use client";
// import React from "react";
// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";

// import { User } from "next-auth";
// import { Button } from "./ui/button";

// const Navbar = () => {
//   const { data: session } = useSession();
//   const user = session?.user;
//   // const signOut = async() =>{
//   //      del
//   // }
//   return (
//     <nav className="p-4 md:p-6 shadow-md bg-gray-600">
//       <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
//         <a href="#" className="text-xl font-bold mb-4 md:mb-0">
//           Mystery Message
//         </a>
//         {session ? (
//           <>
//             <span className="m-4 text-black">
//               {" "}
//               Welcome {user?.username} || {user?.email}{" "}
//             </span>
//             <Button onClick={() => signOut()} className="w-full md:w-auto rounded-md bg-blue-400">
//               Logout
//             </Button>
//           </>
//         ) : (
//           <>
//             <Link href={"/sign-in"}>
//               <Button className="w-full md:w-auto">Login</Button>
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import { Button } from "./ui/button";
import { LogOut, LogIn, MessageCircle } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="bg-gray-700 text-white shadow-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-200">
            <MessageCircle size={28} />
            <span>Mystery Message</span>
          </Link>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            {session ? (
              <>
                <span className="text-gray-300 font-medium">
                  Welcome, <span className="text-blue-400">{user?.username || user?.email}</span>
                </span>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="w-full md:w-auto bg-blue-500 hover:bg-red-600 text-white border-blue-600 hover:border-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button variant="outline" className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white border-blue-600 hover:border-blue-700">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;