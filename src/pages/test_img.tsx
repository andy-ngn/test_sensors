import dynamic from "next/dynamic";
import React from "react";
const Map = dynamic(() => import("@/components/TestMap"), { ssr: false });
const Page = () => {
  return (
    <div>
      <Map />
    </div>
  );
};

export default Page;
