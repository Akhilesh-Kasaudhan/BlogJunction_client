import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
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
  const { categories, loading: catLoading } = useSelector(
    (state) => state.categories
  );

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
    if (!categories.length) {
      dispatch(getCategories());
    }
  }, [dispatch, categories.length]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "text-2xl font-bold mb-2",
          },
        },
      }),
      BulletList,
      OrderedList,
      ListItem,
      Image,
      Link,
      Placeholder.configure({
        placeholder: "Write your blog content here...",
      }),
    ],
    content: "",
  });

  const onSubmit = async (data) => {
    if (!editor || !editor.getText().trim()) {
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
      await dispatch(createPost(formData)).unwrap();
      toast.success("Blog posted successfully!");

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
    <div className="max-w-4xl mx-auto mt-20 px-6 py-8 bg-base-100 rounded-2xl shadow-xl space-y-6 ">
      <h2 className="text-3xl font-extrabold text-center text-primary">
        Create a New Blog
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="label font-semibold">Blog Title</label>
          <input
            {...register("title")}
            className="input input-bordered w-full"
            placeholder="Enter blog title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="label font-semibold">Short Description</label>
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
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}
        </div>

        <div>
          <label className="label font-semibold"> Category</label>
          <select
            {...register("category")}
            className="select select-bordered w-full"
            disabled={catLoading}
          >
            <option value="">Select category</option>
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
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGenerateAi}
            className="btn btn-secondary btn-sm"
            disabled={generateLoading}
          >
            {generateLoading ? "Generating..." : "✨ Generate with AI"}
          </button>
        </div>

        <div>
          <label className="label font-semibold">Blog Content</label>
          {editor && (
            <div className="flex flex-wrap gap-2 mb-2">
              {[
                { label: "Bold", cmd: "toggleBold", active: "bold" },
                { label: "Italic", cmd: "toggleItalic", active: "italic" },
              ].map(({ label, cmd, active }) => (
                <button
                  key={label}
                  type="button"
                  className={`btn btn-sm ${
                    editor.isActive(active) ? "btn-primary" : "btn-outline"
                  }`}
                  onClick={() => editor.chain().focus()[cmd]().run()}
                >
                  {label}
                </button>
              ))}

              {/* Bullet List */}
              <button
                type="button"
                className={`btn btn-sm ${
                  editor.isActive("bulletList") ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                Bullet
              </button>

              {/* Ordered List */}
              <button
                type="button"
                className={`btn btn-sm ${
                  editor.isActive("orderedList") ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                Ordered
              </button>

              {/* H2 */}
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

              {/* Clear */}
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() =>
                  editor.chain().focus().unsetAllMarks().clearNodes().run()
                }
              >
                Clear Format
              </button>
              <button
                type="button"
                className="btn btn-sm btn-error"
                onClick={() => editor.chain().focus().clearContent().run()}
              >
                Clear Content
              </button>
            </div>
          )}
        </div>

        <div
          className="border border-gray-300 p-4 rounded-md min-h-[200px] bg-white shadow-inner cursor-text"
          onClick={() => editor?.chain().focus().run()}
        >
          <EditorContent
            editor={editor}
            className="prose max-w-full focus:outline-none min-h-[150px]"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full text-lg tracking-wide"
          disabled={loading}
        >
          {loading ? "Posting..." : "🚀 Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
