import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    intent: 'primary',
    children: 'Reserve Your Villa Now',
  },
};

export const Secondary: Story = {
  args: {
    intent: 'secondary',
    children: 'Download Investment Guide',
  },
};

export const Ghost: Story = {
  args: {
    intent: 'ghost',
    children: 'Learn More',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: '1-bed',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Schedule a Consultation',
  },
};

export const Loading: Story = {
  args: {
    intent: 'primary',
    isLoading: true,
    children: 'Submitting...',
  },
};

export const Disabled: Story = {
  args: {
    intent: 'primary',
    disabled: true,
    children: 'Coming Soon',
  },
};

