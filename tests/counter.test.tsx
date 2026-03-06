import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "../packages/web-counter/src/Counter";

test("renders initial value", () => {
  render(<Counter initValue={5} />);
  expect(screen.getByText("5")).toBeInTheDocument();
});

test("+1 button increments count", async () => {
  render(<Counter initValue={5} />);
  await userEvent.click(screen.getByRole("button", { name: "+1" }));
  expect(screen.getByText("6")).toBeInTheDocument();
});

test("starts at zero when initValue is 0", () => {
  render(<Counter initValue={0} />);
  expect(screen.getByText("0")).toBeInTheDocument();
});
