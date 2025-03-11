// blocks/HeroBlock.js
const HeroBlock = {
  blockType: 'hero',
  label: 'Hero Block',
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      defaultValue: '',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'richText',
      defaultValue: '',
    },
    {
      name: 'link',
      label: 'Link',
      type: 'link',
      defaultValue: { label: '', url: '' },
    },
  ],
};

export default HeroBlock;
