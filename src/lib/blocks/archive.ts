const archive = {
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
}

export default archive;
