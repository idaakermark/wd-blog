import supabase from "../lib/supabaseClient";

export const getUser = async () => {
  const { data, error } = await supabase
  .from('Users')
  .select()

  return data
};

// export const getUser = () => {
//   //Handle get authenticated user information
// };
