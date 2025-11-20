// src/Services/productService.ts
import { supabase } from "@/Config/supabaseClient";

/**
 * Upload pattern image to storage and return public URL.
 */
export const uploadPatternImage = async (file: File | null) => {
  if (!file) return null;

  const ext = file.name.split(".").pop();
  const fileName = `products/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("factory-images")
    .upload(fileName, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("factory-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
};

/**
 * Create product record and associated operations.
 * productData should use snake_case DB column names.
 */
export const createProduct = async (productData: any, operations: any[] = []) => {
  // Insert product
  const { data: productRow, error: productError } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (productError) throw productError;
  const productId = productRow.id;

  // Insert operations if any
  if (operations && operations.length > 0) {
    const formattedOps = operations.map((op) => ({
      name: op.name,
      operation_code: op.operation_code,
      amount_per_piece: op.amount_per_piece,
      product_id: productId,
    }));

    const { error: opError } = await supabase
      .from("operations")
      .insert(formattedOps);

    if (opError) throw opError;
  }

  // return product including DB fields
  return await getProductById(productId);
};

/**
 * Get products with operations
 */
export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      operations(*)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Get single product
 */
export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      operations(*)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update product row and replace operations.
 * Pass operations as array of { id?, name, operation_code, amount_per_piece }.
 */
export const updateProduct = async (id: string, updates: any, operations: any[] = []) => {
  // Update product row
  const { error: updateError } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id);

  if (updateError) throw updateError;

  // Delete existing operations for product
  const { error: deleteError } = await supabase
    .from("operations")
    .delete()
    .eq("product_id", id);

  if (deleteError) throw deleteError;

  // Insert new operations (if provided)
  if (operations && operations.length > 0) {
    const formattedOps = operations.map((op) => ({
      name: op.name,
      operation_code: op.operation_code,
      amount_per_piece: op.amount_per_piece,
      product_id: id,
    }));

    const { error: insertError } = await supabase
      .from("operations")
      .insert(formattedOps);

    if (insertError) throw insertError;
  }

  return true;
};

/**
 * Delete product and its operations
 */
export const deleteProduct = async (id: string) => {
  await supabase.from("operations").delete().eq("product_id", id);
  await supabase.from("products").delete().eq("id", id);
  return true;
};

/**
 * Toggle product active/inactive
 */
export const toggleProductStatus = async (id: string) => {
  try {
    const { data, error } = await supabase.rpc("toggle_product_status", {
      prod_id: id,
    });
    if (!error) return data;
  } catch (_) {}

  const product = await getProductById(id);
  const newState = !product.is_active;

  const { data, error } = await supabase
    .from("products")
    .update({ is_active: newState })
    .eq("id", id);

  if (error) throw error;
  return data;
};
