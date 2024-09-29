// "use client";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import message from "@/message.json";
// import Autoplay from "embla-carousel-autoplay";

// const page = () => {
//   return (
//     <div className="">
//       <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white h-screen">
//         <section className="text-center mb-8 md:mb-12  w-full bg-gray-600">
//           <h1 className="text-3xl md:text-5xl font-bold">
//             Send Anonymous Messages.
//           </h1>
//           <p className="mt-3 md:mt-4 text-base md:text-lg">
//             Mystery Message - Where your identity remains a secret.
//           </p>
//         </section>
//         <Carousel
//           plugins={[
//             Autoplay({
//               delay: 2000,
//             }),
//           ]}
//         >
//           <CarouselContent>
//             {message.map((val, index) => (
//               <CarouselItem key={index}>
//                 <div className="p-1">
//                   <Card>
//                     <CardContent className="flex  items-center justify-center p-6">
//                       <span className="text-4xl font-semibold">
//                         {val.content}
//                       </span>
//                       <span className="text-4xl font-semibold">
//                         {val.title}
//                       </span>
//                       <span className="text-4xl font-semibold">
//                         {val.received}
//                       </span>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//           <CarouselPrevious />
//           <CarouselNext />
//         </Carousel>
//       </main>
//       <footer className=" flex flex-col justify-center items-center  bg-gray-800 text-white text-md pt-4">
//         <p>A product by Yash Talreja. </p>
//         <p>contact at - yashtalreja180@gmail.com</p>
//       </footer>
//     </div>
//   );
// };

// export default page;

'use client'

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import message from "@/message.json"
import Autoplay from "embla-carousel-autoplay"
import { MessageCircle } from "lucide-react"

export default function AnonymousMessagesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-12 w-full">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Send Anonymous Messages
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">
            Mystery Message - Where your identity remains a secret
          </p>
        </section>
        
        <Carousel
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full max-w-3xl"
        >
          <CarouselContent>
            {message.map((val, index) => (
              <CarouselItem key={index}>
                <Card className="bg-gray-800 border border-gray-700">
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <MessageCircle className="w-12 h-12 mb-4 text-purple-400" />
                    <h2 className="text-2xl font-semibold mb-2 text-purple-300">{val.title}</h2>
                    <p className="text-lg mb-4 text-gray-300">{val.content}</p>
                    <span className="text-sm text-gray-400">Received: {val.received}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-white" />
          <CarouselNext className="text-white" />
        </Carousel>
      </main>
      
      <footer className="flex flex-col justify-center items-center bg-gray-900 text-gray-300 py-6">
        <p className="mb-2">A product by Yash Talreja</p>
        <a href="mailto:yashtalreja180@gmail.com" className="hover:text-purple-400 transition-colors">
          yashtalreja180@gmail.com
        </a>
      </footer>
    </div>
  )
}