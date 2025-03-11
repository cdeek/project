// blocks/MediaBlock.js
const MediaBlock = {
  blockType: 'media',
  label: 'Media Block',
  fields: [
    {
      name: 'mediaUrl',
      label: 'Media URL',
      type: 'text',
      defaultValue: '',
    },
    {
      name: 'mediaType',
      label: 'Media Type',
      type: 'select',
      options: [
        { value: 'image', label: 'Image' },
        { value: 'video', label: 'Video' },
      ],
      defaultValue: 'image',
    },
    {
      name: 'link',
      label: 'Link',
      type: 'link',
      defaultValue: { label: '', url: '' },
    },
  ],
};

export default MediaBlock;
