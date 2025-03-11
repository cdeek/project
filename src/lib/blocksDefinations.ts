// blockDefinitions.js
export const blockDefinitions = {
  content: {
    label: "Content Block",
    fields: [
      {
        name: "invertBackground",
        label: "Invert Background",
        type: "checkbox",
        defaultValue: false,
      },
      {
        name: "columns",
        label: "Columns",
        type: "array",
        // For each column, define its fields
        itemFields: [
          {
            name: "size",
            label: "Column Size",
            type: "select",
            options: [
              { value: "oneThird", label: "One Third" },
              { value: "half", label: "Half" },
              { value: "twoThirds", label: "Two Thirds" },
              { value: "full", label: "Full" },
            ],
            defaultValue: "oneThird",
          },
          {
            name: "richText",
            label: "Content",
            type: "richText", // for simplicity, treat this as a text area
            defaultValue: "",
          },
          {
            name: "enableLink",
            label: "Enable Link",
            type: "checkbox",
            defaultValue: false,
          },
          {
            name: "link",
            label: "Link URL",
            type: "text",
            // Only render this field if enableLink is true:
            condition: (block) => Boolean(block.enableLink),
            defaultValue: "",
          },
        ],
      },
    ],
  },

  mediaBlock: {
    label: "Media Block",
    fields: [
      {
        name: "media",
        label: "Media URL",
        type: "text",
        defaultValue: "",
      },
    ],
  },

  archive: {
    label: "Archive Block",
    fields: [
      {
        name: "introContent",
        label: "Introduction Content",
        type: "richText",
        defaultValue: "",
      },
      {
        name: "populateBy",
        label: "Populate By",
        type: "select",
        options: [
          { value: "collection", label: "Collection" },
          { value: "manual", label: "Manual" },
        ],
        defaultValue: "collection",
      },
      {
        name: "relationTo",
        label: "Relation To",
        type: "text",
        defaultValue: "",
      },
      // Additional fields (such as categories) can be added here...
    ],
  },

  cta: {
    label: "CTA Block",
    fields: [
      {
        name: "richText",
        label: "Rich Text",
        type: "richText",
        defaultValue: "",
      },
      {
        name: "links",
        label: "Links",
        type: "array",
        itemFields: [
          {
            name: "label",
            label: "Label",
            type: "text",
            defaultValue: "",
          },
          {
            name: "url",
            label: "URL",
            type: "text",
            defaultValue: "",
          },
        ],
        defaultValue: [],
      },
    ],
  },
};
