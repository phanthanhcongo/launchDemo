import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './Image';

const meta: Meta<typeof Image> = {
  title: 'Atoms/Image',
  component: Image,
  tags: ['autodocs'],
  argTypes: {
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
    },
    loading: {
      control: 'select',
      options: ['lazy', 'eager'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Image>;

export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
    alt: 'Luxury villa exterior',
    aspectRatio: '16/9',
  },
};

export const Cover: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
    alt: 'Villa with pool',
    objectFit: 'cover',
    aspectRatio: '4/3',
  },
};

export const Contain: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
    alt: 'Villa interior',
    objectFit: 'contain',
    aspectRatio: '16/9',
  },
};

export const Square: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
    alt: 'Villa detail',
    aspectRatio: '1/1',
  },
};

