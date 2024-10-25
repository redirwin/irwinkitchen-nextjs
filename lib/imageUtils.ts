import { supabase } from './supabaseClient'

export async function uploadImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, file)

    if (error) {
      console.error('Error uploading image: ', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error in uploadImage:', error)
    return null
  }
}
