import { supabase } from "./client";

export const uploadVerificationDocument = async (
  userId: string,
  file: File
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/verification/${Math.random()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('verification-documents')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('verification-documents')
    .getPublicUrl(filePath);

  return publicUrl;
};