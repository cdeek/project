"use client"

import { useState } from "react";
import { useRouter } from "next/router";
import BlockEditor from "../components/BlockEditor";
import axios from "axios";

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [meta, setMeta] = useState({ title: "", description: "", image: "" });
  const [blocks, setBlocks] = useState([]);

  const handleSave = async () => {
    const pageData = { title, slug, meta, layout: blocks };
    // Replace with your API endpoint
    await console.log(pageData);
    router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded">
      <h1 className="text-3xl font-bold mb-4">Create New Page</h1>
      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <h3 className="text-xl font-semibold mt-4">SEO Metadata</h3>
      <input
        className="w-full p-2 border rounded mt-2"
        placeholder="Meta Title"
        value={meta.title}
        onChange={(e) => setMeta({ ...meta, title: e.target.value })}
      />
      <input
        className="w-full p-2 border rounded mt-2"
        placeholder="Meta Description"
        value={meta.description}
        onChange={(e) => setMeta({ ...meta, description: e.target.value })}
      />
      <input
        className="w-full p-2 border rounded mt-2"
        placeholder="Meta Image URL"
        value={meta.image}
        onChange={(e) => setMeta({ ...meta, image: e.target.value })}
      />

      <BlockEditor blocks={blocks} setBlocks={setBlocks} />

      <button
        onClick={handleSave}
        className="w-full bg-green-500 text-white p-3 rounded mt-4 hover:bg-green-600"
      >
        Save Page
      </button>
    </div>
  );
}
