// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'overview',
    {
      items: ['usage/getting-started'],
      label: 'Usage',
      link: {
        type: 'doc',
        id: 'usage/index',
      },
      type: 'category',
    },
  ],
};

module.exports = sidebars;
