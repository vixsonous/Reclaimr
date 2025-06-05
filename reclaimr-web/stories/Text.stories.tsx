import Text from "@/app/_components/Text";
import { Meta, StoryObj } from "@storybook/nextjs";

const meta = {
  title: 'Text',
  component: Text,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof Text>

export default meta;
type Story = StoryObj<typeof meta>;

export const TextDefault: Story = {
  args: {
    children: 'This is a text'
  }
}