import type { Meta, StoryObj } from "@storybook/react";
import { Counter } from "../packages/web-counter/src/Counter";

const meta: Meta<typeof Counter> = {
  component: Counter,
  title: "Components/Counter",
};

export default meta;

type Story = StoryObj<typeof Counter>;

export const Default: Story = {
  args: { initValue: 0 },
};

export const HighInitValue: Story = {
  args: { initValue: 87 },
};
