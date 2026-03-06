import React, { useState } from "react";

export const Counter: React.FC<{ initValue: number }> = ({ initValue }) => {
  const [count, setCount] = useState(initValue);

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
};
