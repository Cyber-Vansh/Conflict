"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function Home() {
  // fetch profileImageID from api and add it in profileImage
  const [profileImage, setProfileImage] = useState(false);

  return (
    <div className="p-10 ">
      <div>
        <img
          src="https://www.chess.com/bundles/web/images/index-page/index-illustration.9d2cb1c3@2x.png"
          className="ml-20 h-120"
        />
        <Link href="/Profile" className="absolute top-0 right-0">
          {profileImage ? (
            <img
              src="https://cdn-icons-png.flaticon.com/128/15685/15685758.png"
              className="m-6 h-10 w-10 invert transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <img
              src="https://cdn-icons-png.flaticon.com/128/15685/15685758.png"
              className="m-6 h-10 w-10 invert transition-transform duration-300 hover:scale-105"
            />
          )}
        </Link>
        <div className="flex flex-col absolute bottom-0 left-0 p-4 ml-25 mb-20 gap-6">
          <Link href="/Duels">
            <button
              className="text-white p-2 text-4xl relative text-white hover:text-green-800 transition-colors duration-300
                               after:content-[''] after:absolute after:left-0 after:bottom-0
                               after:w-0 hover:after:w-full after:h-[2px]
                               after:bg-green-800 after:transition-all after:duration-300"
            >
              Duels
            </button>
          </Link>
          <Link href="/Havoc">
            <button
              className="text-white p-2 text-4xl relative text-white hover:text-green-800 transition-colors duration-300
                               after:content-[''] after:absolute after:left-0 after:bottom-0
                               after:w-0 hover:after:w-full after:h-[2px]
                               after:bg-green-800 after:transition-all after:duration-300"
            >
              Havoc
            </button>
          </Link>
        </div>
        <div className="absolute bottom-0 right-0 bg-neutral-800 m-6 w-100 h-100 rounded-2xl">
          <Tabs
            defaultValue="duel"
            className="top-0 right-0 w-[400px] dark:bg-gray-900 dark"
          >
            <TabsList>
              <TabsTrigger value="duel">Duel</TabsTrigger>
              <TabsTrigger value="havoc">Havoc</TabsTrigger>
            </TabsList>
            <TabsContent value="duel">duel leaderboard</TabsContent>
            <TabsContent value="havoc">havoc leaderboard</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
