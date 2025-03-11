const cta = {
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
}

export default cta;
