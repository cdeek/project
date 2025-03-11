const content = {
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
}

export default content;
