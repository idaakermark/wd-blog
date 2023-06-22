import { supabase } from "../lib/supabaseClient"
import { uploadImage } from "../utils/uploadImage";
export const postsCacheKey = '/api/blogs'


export const getPosts = async () => {
  //Handle get all posts
  const { data, error, status } = await supabase
  .from('posts')
  .select()
  return { data, error, status }
};

export const getPost = async ({ slug }) => {
  const { data, error, status } = await supabase
  .from('posts')
  .select('*')
  .single()
  .eq('slug', slug);

  return { error, status, data }
};

export const addPost = async (_, { arg: newPost}) => {
  let image = ""

  if (newPost?.image) {
    const { publicUrl, error } = await uploadImage(newPost?.image)

    if (!error) {
      image = publicUrl
  
    }
  }
  const { data, error, status } = await supabase
  .from("posts")
  .insert({ ...newPost, image })
  .select()
  .single();

  return { data, error, status };
};

// export const removePost = async (_, { arg: postId }) => {
//   const { error, data } = await supabase
//   .from('posts')
//   .delete()
//   .eq('id', postId)

//   if (error) {
//     console.log("Failed to delete data.", error);
//   }

//   return {error, data}
// };

export const removePost = async (_, { arg: postId }) => {
  // Delete associated comments
  await supabase.from('comments').delete().eq('post_id', postId);

  // Delete the post
  const { error, data } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .single();

  if (error) {
    console.log("Failed to delete data.", error);
  }

  return { error, data };
};

// export const editPost = async (_, { arg: updatedPost }) => {
//   let image = updatedPost?.image ?? "";

//   const isNewImage = typeof image === "object" && image !== null;

//   if (isNewImage) {
//     const { publicUrl, error } = await uploadImage(updatedPost?.image);

//     if (!error) {
//       image = publicUrl;
//     }
//   }

//   const { data, error, status } = await supabase
//     .from("posts")
//     .update({ ...updatedPost, image })
//     .eq("id", updatedPost.id)
//     .select()
//     .single();

//   return { data, error, status };
// };

export const editPost = async (_, { arg: updatedPost }) => {
  let image = updatedPost?.image ?? "";

  const isNewImage = typeof image === "object" && image !== null;

  if (isNewImage) {
    const { publicUrl, error } = await uploadImage(updatedPost?.image);

    if (!error) {
      image = publicUrl;
    }
  }

  const { error: updateError } = await supabase
    .from("posts")
    .update({ ...updatedPost, image })
    .eq("id", updatedPost.id);

  if (updateError) {
    console.log("Failed to update post.", updateError);
    return { error: updateError };
  }

  const { data: updatedData, error: selectError } = await supabase
    .from("posts")
    .select()
    .eq("id", updatedPost.id)
    .single();

  if (selectError) {
    console.log("Failed to fetch updated post.", selectError);
    return { error: selectError };
  }

  return { data: updatedData, error: null, status: "success" };
};
