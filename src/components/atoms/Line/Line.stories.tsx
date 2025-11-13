import type { Meta, StoryObj } from '@storybook/react';
import { Line } from './Line';

const meta: Meta<typeof Line> = {
  title: 'Atoms/Line',
  component: Line,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'border'],
    },
    thickness: {
      control: 'select',
      options: ['thin', 'medium', 'thick'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', background: '#372016' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Line>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    color: 'primary',
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    color: 'primary',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '200px', background: '#372016' }}>
        <Story />
      </div>
    ),
  ],
};

export const Secondary: Story = {
  args: {
    orientation: 'horizontal',
    color: 'secondary',
  },
};

export const Thick: Story = {
  args: {
    orientation: 'horizontal',
    color: 'primary',
    thickness: 'thick',
  },
};

export const Medium: Story = {
  args: {
    orientation: 'horizontal',
    color: 'primary',
    thickness: 'medium',
  },
};

