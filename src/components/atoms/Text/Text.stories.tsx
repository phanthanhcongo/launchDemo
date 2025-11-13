import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Atoms/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'body', 'caption', 'menu', 'cta'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'surface'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: 'Welcome to nyala Villas',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: 'A Tulum-inspired haven',
  },
};

export const Heading3: Story = {
  args: {
    variant: 'h3',
    children: 'Discover Your Dream Villa',
  },
};

export const Heading4: Story = {
  args: {
    variant: 'h4',
    children: 'One-Bedroom Villa',
  },
};

export const Body: Story = {
  args: {
    variant: 'body',
    children:
      "Nyala Villas brings together the best of Tulum's laid-back elegance and Mediterranean sophistication.",
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'first name',
  },
};

export const Menu: Story = {
  args: {
    variant: 'menu',
    children: 'HOME',
  },
};

export const CTA: Story = {
  args: {
    variant: 'cta',
    children: 'Reserve Your Villa Now',
  },
};

export const SecondaryColor: Story = {
  args: {
    variant: 'h2',
    color: 'secondary',
    children: 'Unlock Exceptional Returns',
  },
};

