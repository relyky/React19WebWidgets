import type { Meta, StoryObj } from "@storybook/react";
import { Greeting } from "../packages/web-greeting/src/Greeting";

const meta: Meta<typeof Greeting> = {
  component: Greeting,
  title: "Components/Greeting",
};

export default meta;

type Story = StoryObj<typeof Greeting>;

export const Default: Story = {
  args: { name: "郝聰明" },
};

export const LongName: Story = {
  args: { name: "一個非常非常長的名字測試看看" },
};
