import { render, screen } from "@testing-library/react";
import { Greeting } from "../packages/web-greeting/src/Greeting";

test("renders greeting with name", () => {
  render(<Greeting name="郝聰明" />);
  expect(screen.getByText("你好，郝聰明！")).toBeInTheDocument();
});

test("renders greeting with different name", () => {
  render(<Greeting name="世界" />);
  expect(screen.getByText("你好，世界！")).toBeInTheDocument();
});
