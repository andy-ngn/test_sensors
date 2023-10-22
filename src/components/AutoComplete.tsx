import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ScrollArea } from "./ui/scroll-area";

const AutoComplete: React.FC<{
  data: Array<string>;
  onChange: (value: string) => void;
  value: string | undefined;
  loading?: boolean;
  label?: string;
  emptyString?: string;
  width?: number;
}> = ({
  data,
  onChange,
  value,
  loading,
  label = "Search...",
  emptyString = "Empty",
  width,
}) => {
  const [open, setOpen] = React.useState(false);
  const actualFind = React.useCallback(
    (value: string) => {
      return data.find(
        (x) => x.toLowerCase().trim() === value.toLowerCase().trim()
      );
    },
    [data]
  );
  const widthClassName = "w-[280px]";
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(`justify-between`, widthClassName)}
        >
          {loading ? "Loading" : value ? actualFind(value) : label}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(`p-0`, widthClassName)}>
        <Command>
          <CommandInput placeholder='Search...' />
          <CommandEmpty>{emptyString}</CommandEmpty>
          <CommandGroup>
            <ScrollArea className='h-72'>
              {data.map((d) => (
                <CommandItem
                  key={d}
                  onSelect={(currentValue) => {
                    const result = actualFind(currentValue);
                    if (result) {
                      onChange(result);
                    }

                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === d ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {d}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AutoComplete;
