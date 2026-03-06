import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Greeting } from "../packages/web-greeting/src/Greeting";
import { Counter } from "../packages/web-counter/src/Counter";

test("renders Greeting and Counter together", () => {
  render(
    <div>
      <Greeting name="整合測試" />
      <Counter initValue={10} />
    </div>
  );
  expect(screen.getByText("你好，整合測試！")).toBeInTheDocument();
  expect(screen.getByText("10")).toBeInTheDocument();
});

test("Counter increments independently alongside Greeting", async () => {
  render(
    <div>
      <Greeting name="郝聰明" />
      <Counter initValue={3} />
    </div>
  );
  await userEvent.click(screen.getByRole("button", { name: "+1" }));
  expect(screen.getByText("你好，郝聰明！")).toBeInTheDocument();
  expect(screen.getByText("4")).toBeInTheDocument();
});
