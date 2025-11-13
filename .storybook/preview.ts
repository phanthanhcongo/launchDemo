import type { Preview } from '@storybook/react';
import '../src/styles/tokens.css';
import '../src/i18n/config';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#372016',
        },
        {
          name: 'light',
          value: '#FFF7ED',
        },
      ],
    },
  },
};

export default preview;

