"use client";
import { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/app/_providers/Auth";
import { Message } from "@/app/_components/Message";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  } from "@/app/_components/ui/select";

export default function AddProduct() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState<string>("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const { token } = useAuth();

  // Helper functions for managing lists (tags and keywords)
  const handleAddItem = (input: string, list: string[], setter: (value: string[]) => void, resetInput: () => void) => {
    if (input.trim() && !list.includes(input)) {
      setter([...list, input]);
      resetInput();
    }
  };

  const handleRemoveItem = (item: string, list: string[], setter: (value: string[]) => void) => {
    setter(list.filter((i) => i !== item));
  };

  // Image management
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      if (imageFiles.length + fileArray.length > 4) {
        alert("You can only upload up to 4 images.");
        return;
      }
      setImageFiles((prev) => [...prev, ...fileArray]);
      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
  
      // Revoke old object URLs to prevent memory leaks
      return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImageFiles = [...imageFiles];
    const newImagePreviews = [...imagePreviews];
    newImageFiles.splice(index, 1);
    newImagePreviews.splice(index, 1);
    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
  };
  
  // Video management
  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxSize = 6 * 1024 * 1024;
  
    if (file) {
      if (file.size > maxSize) {
        alert("File size exceeds 6MB limit.");
        setVideoFile(null);
      } else {
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
        setVideoFile(file);
  
        // Revoke the URL when component unmounts
        return () => URL.revokeObjectURL(url);
      }
    }
  };

  // Form submission
  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("tags", JSON.stringify(tags));
    formData.append("keywords", JSON.stringify(keywords));
    imageFiles.forEach((file) => formData.append("images", file));
    if (videoFile) formData.append("video", videoFile);

    try {
      const response = await fetch("http://localhost:3000/" + process.env.NEXT_PUBLIC_API_URL + "product/auth", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(result.message || "Product added successfully!");
        setError(null);
      } else {
        setError(result.error || "An error occurred.");
        setSuccess(null);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Add New Product</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Title */}
          <Input
            label="Product Title"
            name="title"
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter product title"
            id="title"
            type="text"
          />
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              id="description"
              rows={4}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter product description"
              {...register("description", { required: "Description is required" })}
            ></Textarea>
            {errors.description && <span className="text-red-600 text-sm">{errors.description.message}</span>}
          </div>

          {/* Price */}
            <Input
              type="number"
              name="price"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter product price"
              required
              min="1"
              label="Price ($)"
            />

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <Select name="category" className="p-3" id="category" required {...register("category", { required: "Category is required" })}>
              <SelectTrigger className="my-4">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
               <SelectItem value="phone">Phone</SelectItem>
               <SelectItem value="fabrics">Fabrics</SelectItem>
               <SelectItem value="gaming">Gaming</SelectItem>
               <SelectItem value="accessories">Accessories</SelectItem>
               <SelectItem value="clothing">Clothing</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <span className="text-red-600 text-sm">{errors.category.message}</span>}
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                type="text"
                label="Tags"
                name="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter a tag"
              />
              <button
                type="button"
                onClick={() => handleAddItem(tagInput, tags, setTags, () => setTagInput(""))}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center space-x-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(tag, tags, setTags)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                type="text"
                label="Keywords"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter a keyword"
              />
              <button
                type="button"
                onClick={() => handleAddItem(keywordInput, keywords, setKeywords, () => setKeywordInput(""))}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center space-x-2"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(keyword, keywords, setKeywords)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Input
              label="Add Images max(4)"
              type="file"
              id="images"
              multiple
              required
              accept="image/*"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
              onChange={handleImageChange}
            />
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-auto rounded-md shadow-md" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <Input
              type="file"
              label="video"
              id="video"
              accept="video/*"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
              onChange={handleVideoChange}
            />
            {videoPreview && (
              <div className="mt-4">
                <video src={videoPreview} controls className="w-full h-auto rounded-md shadow-md" />
              </div>
            )}
          </div>
          
          {/* availabity */}
          <Select
            name="availability"
            id="availability"
            {...register("availability", { required: "Availability is required" })}
          >
            <SelectTrigger className="my-4">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="In stock">In stock</SelectItem>
              <SelectItem value="Few in stock">Few in stock</SelectItem>
              <SelectItem value="Out of stock">Out of stock</SelectItem>
            </SelectContent>
          </Select>
          {errors.availability && (
            <span className="text-red-600 text-sm">{errors.availability.message}</span>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Add Product"}
          </button>
        </form>
        
        {/* Success/Error Messages */}
        {success && <Message success={success} className="mt-4" />}
        {error && <Message error={error} className="mt-4" />}
      </div>
    </div>
  );
}

