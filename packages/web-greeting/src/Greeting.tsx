import React from "react";

export const Greeting: React.FC<{ name: string }> = ({ name }) => {
  return <p>你好，{name}！</p>;
};
