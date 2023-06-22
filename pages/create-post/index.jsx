import BlogEditor from "@/components/blog-editor";
import { createSlug } from "@/utils/createSlug";
import useSWRMutation from "swr/mutation";
import { postsCacheKey, addPost } from "../../api-routes/posts";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

export default function CreatePost() {
  const router = useRouter();
  const user = useUser();

  const { trigger: addPostTrigger } = useSWRMutation(postsCacheKey, addPost);

  const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
    const slug = createSlug(titleInput);

    const newPost = {
      body: editorContent,
      title: titleInput,
      slug,
      user_id: user.id,
      image, //Pass it in here
    };
    const { error } = await addPostTrigger(newPost);

    if (!error) {
      router.push(`/blog/${slug}`);
    }
  };
  
  return (
    <BlogEditor
      heading="Create post"
      onSubmit={handleOnSubmit}
      buttonText="Upload post"
    />
  );
}
