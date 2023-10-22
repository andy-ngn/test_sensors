import type { Except } from "type-fest";

type Foo = {
  unicorn: string;
  rainbow: boolean;
};

type FooWithoutRainbow = Except<Foo, "rainbow">;
type UseOmit = Omit<Foo, "rainbow">;
