import type { FC } from "react";

export const Greeting: FC<{ name: string }> = ({ name }) => {
  return <p>你好，{name}！</p>;
};
