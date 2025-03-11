import React from "react";
import RichTextEditor from '@/components/RichTextEditor';

// Renders a single field based on its type.
function renderField(field, block, onChange) {
  // If there's a condition and it fails, skip this field.
  if (field.condition && !field.condition(block)) return null;

  const value = block[field.name] ?? field.defaultValue;
  const handleChange = (e) =>
    onChange(field.name, e.target.type === "checkbox" ? e.target.checked : e.target.value);

  switch (field.type) {
    case "checkbox":
      return (
        <div key={field.name} className="mb-2">
          <label>
            <input type="checkbox" checked={value} onChange={handleChange} /> {field.label}
          </label>
        </div>
      );
    case "select":
      return (
        <div key={field.name} className="mb-2">
          <label>{field.label}</label>
          <select value={value} onChange={handleChange} className="w-full border p-1 rounded">
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "richText":
      return (
        <div key={field.name} className="mb-2">
          <label className="block mb-1">{field.label}</label>
          <RichTextEditor value={value} onChange={(content) => onChange(field.name, content)} />
        </div>
     );
    case "text":
      return (
        <div key={field.name} className="mb-2">
          <label>{field.label}</label>
          <input type="text" value={value} onChange={handleChange} className="w-full border p-1 rounded" />
        </div>
      );
    case "array":
      return (
        <div key={field.name} className="mb-2">
          <label>{field.label}</label>
          <DynamicArrayEditor
            items={block[field.name] || field.defaultValue}
            itemFields={field.itemFields}
            onChange={(newItems) => onChange(field.name, newItems)}
          />
        </div>
      );
    case "link":
      return (
        <div key={field.name} className="mb-2">
          <label>{field.label}</label>
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Label"
              value={(value && value.label) || ""}
              onChange={(e) => onChange(field.name, { ...value, label: e.target.value })}
              className="w-full border p-1 rounded"
            />
            <input
              type="text"
              placeholder="URL"
              value={(value && value.url) || ""}
              onChange={(e) => onChange(field.name, { ...value, url: e.target.value })}
              className="w-full border p-1 rounded"
            />
          </div>
        </div>
      );
    default:
      return null;
  }
}

// For array fields, render a list of sub-fields.
function DynamicArrayEditor({ items, itemFields, onChange }) {
  const updateItem = (index, key, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    onChange(newItems);
  };

  const addItem = () => {
    const newItem = {};
    itemFields.forEach((field) => {
      newItem[field.name] = field.defaultValue || "";
    });
    onChange([...(items || []), newItem]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  return (
    <div className="border p-2 mt-2">
      {items &&
        items.map((item, index) => (
          <div key={index} className="p-2 border rounded mb-2">
            {itemFields.map((field) => (
              <div key={field.name} className="mb-1">
                <label>{field.label}</label>
                {field.type === "text" || field.type === "richText" ? (
                  <input
                    type="text"
                    value={item[field.name]}
                    onChange={(e) => updateItem(index, field.name, e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                ) : null}
              </div>
            ))}
            <button onClick={() => removeItem(index)} className="bg-red-500 text-white p-1 rounded mt-1">
              Remove
            </button>
          </div>
        ))}
      <button onClick={addItem} className="bg-blue-500 text-white p-2 rounded">
        Add Item
      </button>
    </div>
  );
}

// The main dynamic block editor renders a block based on its definition.
export default function DynamicBlockEditor({ block, index, updateBlock, removeBlock, blockDefinitions }) {

  const onFieldChange = (key, value) => {
    updateBlock(index, { ...block, [key]: value });
  };

  return (
    <div className="p-4 border rounded mb-4 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xl font-bold">{blockDef.label}</h4>
        <button onClick={() => removeBlock(index)} className="bg-red-500 text-white px-2 py-1 rounded">
          Remove Block
        </button>
      </div>
      {block.fields.map((field) => renderField(field, block, onFieldChange))}
    </div>
  );
}
