import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useDispatch, useSelector } from "react-redux";
import { createPost, generateContent } from "../redux/slices/postThunk";
import { toast } from "react-toastify";
import { getCategories } from "../redux/slices/categorySlice";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  desc: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().nonempty("Category is required"),
  image: z
    .any()
    .refine((file) => file?.length === 1, "Cover image is required"),
});

const CreateBlog = () => {
  const dispatch = useDispatch();
  const {
    categories,
    loading: catLoading,
    error: catError,
  } = useSelector((state) => state.categories);

  const { generateLoading } = useSelector((state) => state.posts);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      Placeholder.configure({
        placeholder: "Write your blog content here...",
      }),
    ],
    content: "",
  });

  const onSubmit = async (data) => {
    if (!editor) {
      toast.error("Blog content cannot be empty");
      return;
    }

    const htmlContent = editor.getHTML();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("content", htmlContent);
    formData.append("category", data.category);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    setLoading(true);
    try {
      const res = await dispatch(createPost(formData)).unwrap();
      toast.success("Blog posted successfully!");
      console.log(res);
      reset();
      editor.commands.clearContent();
    } catch (err) {
      toast.error(err?.message || "Failed to post blog");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAi = async () => {
    const { title, desc } = getValues();
    if (!title || !desc) {
      toast.error("Title and Description are required");
      return;
    }
    try {
      const generated = await dispatch(
        generateContent({ title, desc })
      ).unwrap();

      editor.commands.setContent(generated);
      toast.success("AI-generated content added!");
    } catch (error) {
      toast.error(error?.message || "Failed to generate content");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-lg space-y-4">
      <h2 className="text-2xl font-bold">Create a New Blog</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label font-semibold">Blog Title</label>
          <input
            {...register("title")}
            className="input input-bordered w-full"
            placeholder="Enter blog title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="label font-semibold">Blog Description</label>
          <textarea
            {...register("desc")}
            className="textarea textarea-bordered w-full"
            placeholder="Short blog description"
            rows={3}
          />
          {errors.desc && (
            <p className="text-red-500 text-sm">{errors.desc.message}</p>
          )}
        </div>

        <div>
          <label className="label font-semibold">Cover Image</label>
          <input
            type="file"
            {...register("image")}
            className="file-input file-input-bordered w-full"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>

        <div>
          <label className="label font-semibold">Blog Category</label>
          <select
            {...register("category")}
            className="select select-bordered w-full"
            disabled={catLoading}
          >
            <option value="">Select a category</option>
            {categories &&
              categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleGenerateAi}
          className="btn btn-secondary"
          disabled={generateLoading}
        >
          {generateLoading ? "Generating..." : "Generate Using AI"}
        </button>

        <div>
          <label className="label font-semibold">Blog Content</label>
          {editor && (
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                type="button"
                className={`btn btn-sm ${
                  editor.isActive("bold") ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                Bold
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  editor.isActive("italic") ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                Italic
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  editor.isActive("bulletList") ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                • Bullet List
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  editor.isActive("orderedList") ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                1. Ordered List
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  editor.isActive("heading", { level: 2 })
                    ? "btn-primary"
                    : "btn-outline"
                }`}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
              >
                H2
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() =>
                  editor.chain().focus().unsetAllMarks().clearNodes().run()
                }
              >
                Clear Format
              </button>
            </div>
          )}

          <div className="border border-gray-300 p-2 rounded-md min-h-[200px] bg-white">
            <EditorContent editor={editor} />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
