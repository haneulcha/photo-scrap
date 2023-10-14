const { SUPABASE_URL, SUPABASE_API_KEY, SUPABSE_BUCKET_NAME } = process.env;

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL ?? "", SUPABASE_API_KEY ?? "");

export const uploadFile = async (file: { name: string; blob: Blob }) => {
  if (!file || !SUPABSE_BUCKET_NAME) return;

  try {
    const { data } = await supabase.storage
      .from(SUPABSE_BUCKET_NAME)
      .upload(file.name, file.blob);

    return data;
  } catch (e) {
    console.log(e);
  }

  return;
};
