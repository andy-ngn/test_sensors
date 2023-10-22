import React from "react";
import type { NextPage } from "next";
import AutoCompleteIndices from "@/components/AutoCompleteIndices";
const Page: NextPage = () => {
  return (
    <div className='container p-2'>
      <AutoCompleteIndices />
    </div>
  );
};

export default Page;
