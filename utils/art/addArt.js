import supabase from "../general/supabaseclient"

export async function addArt({ name, description, file, created }) {
  try {
    const fileName = `${Date.now()}_${file.name}`
    const { data: storageData, error: storageError } = await supabase.storage
      .from("art")
      .upload(fileName, file)

    if (storageError) throw storageError
    const { data: publicUrlData } = supabase.storage
      .from("art")
      .getPublicUrl(fileName)

    const imageUrl = publicUrlData.publicUrl
    const { data: tableData, error: tableError } = await supabase
      .from("artwork")
      .insert([
        {
          name,
          description,
          image: imageUrl,
          created,
        },
      ])
      .select()

    if (tableError) throw tableError
    return tableData
  } catch (err) {
    console.error("Error adding art:", err.message)
    return null
  }
}
