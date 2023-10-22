import dynamic from "next/dynamic";
import React from "react";
const BaseMap = dynamic(() => import("@/components/bases/Map"), { ssr: false });
const Page = () => {
  return (
    <div>
      <BaseMap />
    </div>
  );
};

export default Page;
