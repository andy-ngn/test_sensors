import Sensors from "@/components/Sensors";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
const MyMap = dynamic(() => import("@/components/MyMap"), { ssr: false });
import { useState } from "react";
export default function Home() {
  const [ask, setAsk] = useState(false);
  const [isClick, setIsClick] = useState(false);

  return (
    <main>
      <div>
        <MyMap askPermission={ask} setAskPermission={setAsk} />
      </div>
      {!ask && !isClick && (
        <div
          onClick={() => {
            setAsk(true);
            setIsClick(true);
          }}
          className='absolute top-0 left-0 h-screen w-screen bg-slate-400 text-yellow-400 opacity-60 z-[1000] cursor-pointer'
        >
          Click
        </div>
      )}
    </main>
  );
}
