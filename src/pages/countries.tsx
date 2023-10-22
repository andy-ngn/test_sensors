const WorldMap = dynamic(() => import("@/components/World"), { ssr: false });
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";

const Page: NextPage = () => {
  return (
    <div>
      <WorldMap />
    </div>
  );
};

export default Page;
