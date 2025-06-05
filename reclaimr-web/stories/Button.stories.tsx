import {Meta, StoryObj} from "@storybook/nextjs";
import Button from "../app/_components/Button";

const meta = {
  title: "Button",
  component: Button,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof Button>

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonDefault: Story = {
  args: {
    children: 'Button'
  }
}