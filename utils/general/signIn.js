import supabase from "./supabaseclient"; 

export default async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return null;
  }

  return data; 
}