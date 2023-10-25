import Sensors from "@/components/Sensors";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
const MyMap = dynamic(() => import("@/components/MyMap"), { ssr: false });
import { useState } from "react";
export default function Home() {
  return (
    <main>
      <div>
        <MyMap />
      </div>
    </main>
  );
}
