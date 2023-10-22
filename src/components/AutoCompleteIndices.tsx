import * as React from "react";
import { Button } from "@/components/ui/button";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

import AutoComplete from "./AutoComplete";

function AutoCompleteIndices() {
  const router = useRouter();

  const index_query = router.query.index
    ? decodeURI(String(router.query.index))
    : undefined;

  const [value, setValue] = React.useState("");
  React.useEffect(() => {
    if (index_query) setValue(index_query);
  }, [index_query]);

  const onSubmit = () => {
    if (!value) return;
    router.replace({ query: { ...router.query, index: encodeURI(value) } });
  };
  const { data: indices, isLoading } = useQuery({
    queryKey: ["indices"],
    queryFn: async () =>
      axios.get<string[]>("/api/indices").then((res) => res.data),
    select: (data) =>
      data.map((x) => x.trim()).sort((a, b) => a.localeCompare(b)),
  });

  return (
    <div>
      <AutoComplete
        value={value}
        onChange={(newValue) => setValue(newValue)}
        loading={isLoading}
        data={indices ?? []}
        width={400}
      />

      <div className='flex my-2 gap-2'>
        <Button onClick={onSubmit}>Go</Button>
        <Button
          color='secondary'
          variant='outline'
          onClick={() => {
            setValue("");
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
export default AutoCompleteIndices;
