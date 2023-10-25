import Sensors from "@/components/Sensors";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
const MyMap = dynamic(() => import("@/components/MyMap"), { ssr: false });
import { useState } from "react";
export default function Home() {
  const [ask, setAsk] = useState(false);
  const [viewState, setViewState] = useState<Object>({});

  return (
    <main>
      <div>
        <MyMap askPermission={ask} setAskPermission={setAsk} />
      </div>
      <div>{!viewState ? null : JSON.stringify(viewState, null, 2)}</div>
    </main>
  );
}
