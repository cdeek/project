"use client"

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues in Next.js
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function RichTextEditor({ value, onChange }) {
  const [content, setContent] = useState(value || '');

  useEffect(() => {
    setContent(value || '');
  }, [value]);

  const handleChange = (val) => {
    setContent(val);
    onChange(val);
  };

  return (
    <ReactQuill
      value={content}
      onChange={handleChange}
      theme="snow"
      className="border rounded"
    />
  );
}
