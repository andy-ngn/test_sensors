import dynamic from "next/dynamic";
import React from "react";
const BaseMap = dynamic(() => import("@/components/bases/LeafletMap"), {
  ssr: false,
});
const Page = () => {
  return (
    <div>
      <BaseMap />
    </div>
  );
};

export default Page;
