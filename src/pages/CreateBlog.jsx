import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Editor } from "react-draft-wysiwyg";
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
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const { generateLoading } = useSelector((state) => state.posts);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      toast.error("Blog content cannot be empty");
      return;
    }
    const content = JSON.stringify(convertToRaw(contentState));

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("content", content);
    formData.append("category", data.category);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    setLoading(true);
    try {
      const res = await dispatch(createPost(formData)).unwrap();
      toast.success("Blog posted successfully!");
      console.log(res);
      setEditorState(EditorState.createEmpty());
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
      const content = await dispatch(generateContent({ title, desc })).unwrap();

      const blocksFromHtml = htmlToDraft(await content);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
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
          <div className="border border-gray-300 p-2 rounded-md min-h-[200px] bg-white">
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "list",
                  "textAlign",
                  "link",
                  "emoji",
                  "image",
                ],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
              }}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
            />
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
