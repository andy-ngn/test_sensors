import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  type ForwardRefRenderFunction,
  Fragment,
  useId,
  useRef,
  useEffect,
} from "react";

type InputHandler = {
  clearField: () => void;
  autoFill?: () => void;
};
type Props = { label?: string };
const MyInput: ForwardRefRenderFunction<InputHandler, Props> = (
  { label }: Props,
  ref
) => {
  //   const countDown = use(
  //     new Promise<number>((resolve) => {
  //       setTimeout(() => resolve(10), 200);
  //     })
  //   );
  const [data, setData] = useState("");
  useEffect(() => {
    new Promise<string>((resolve) =>
      setTimeout(() => resolve("Hello world"), 2000)
    ).then((res) => setData(res));
  }, []);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");
  useImperativeHandle(ref, () => {
    return {
      clearField() {
        setValue("");
        inputRef.current?.focus();
      },
      autoFill() {
        setValue("Hello");
      },
    };
  });
  return (
    <Fragment>
      <div>Data: {data}</div>
      <label htmlFor={inputId}>{label ?? "generic"}</label>
      <input
        ref={inputRef}
        id={inputId}
        type='text'
        className='border rounded-md'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Fragment>
  );
};

export default forwardRef(MyInput);
