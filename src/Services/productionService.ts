// src/Services/productionService.ts
import { supabase } from "@/Config/supabaseClient";

/**
 * Get all products (used to choose product when creating production)
 */
export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};

/**
 * Get all productions (include product name by left-joining products)
 * We'll fetch products separately and map so code is robust if FK relationship name differs.
 */
export const getProductions = async () => {
  const { data, error } = await supabase
    .from("production")
    .select(`
      *,
      production_operation:production_operation (
        id,
        operation_id,
        worker_id,
        worker_name,
        pieces_done,
        earnings,
        date
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  const productions = data ?? [];

  // fetch products for mapping product name (avoid N+1 queries)
  try {
    const { data: products } = await supabase.from("products").select("id,name");
    const prodMap: Record<string, string> = {};
    (products || []).forEach((p: any) => {
      if (p && p.id) prodMap[p.id] = p.name;
    });

    return productions.map((p: any) => ({
      ...p,
      productName: p.product_id ? prodMap[p.product_id] ?? null : null,
    }));
  } catch (err) {
    // if product fetching fails, return productions without productName
    return productions;
  }
};



/**
 * Get single production by id and include its production_operation rows
 */
export const getProductionById = async (id: string) => {
  const { data: production, error: prodError } = await supabase
    .from("production")
    .select("*")
    .eq("id", id)
    .single();

  if (prodError) throw prodError;

  const operations = await getOperationsByProductionId(id);

  // fetch product name
  let productName = null;
  if (production.product_id) {
    const { data: p } = await supabase.from("products").select("name").eq("id", production.product_id).single();
    if (p) productName = p.name;
  }

  return {
    ...production,
    productName,
    operations,
  };
};

/**
 * Create production row and automatically copy operations from product's operations
 * into production_operation table (so each production has its own production_operation entries).
 * Accepts a productionData object matching 'production' table columns.
 */
export const createProduction = async (productionData: any) => {
  // 1) insert production
  const { data: prodRow, error: insertError } = await supabase
    .from("production")
    .insert(productionData)
    .select()
    .single();

  if (insertError) throw insertError;

  const productionId = prodRow.id;

  // 2) fetch operations for this product (operation master table)
  const { data: ops, error: opError } = await supabase
    .from("operations")
    .select("*")
    .eq("product_id", productionData.product_id);

  if (opError) throw opError;

  // 3) insert production_operation rows
  if (ops && ops.length > 0) {
    const formatted = ops.map((o: any) => ({
      production_cutting_id: null,
      operation_id: o.id,
      worker_id: null,
      worker_name: null,
      pieces_done: 0,
      earnings: 0,
      date: new Date().toISOString().split("T")[0], // date string
      supervisor_employee_id: null,
      production_id: productionId,
      created_at: new Date().toISOString(),
    }));

    const { error: insertOpsError } = await supabase
      .from("production_operation")
      .insert(formatted);

    if (insertOpsError) throw insertOpsError;
  }

  return prodRow;
};

/**
 * Get production_operation rows by production id
 */
export const getOperationsByProductionId = async (productionId: string) => {
  const { data, error } = await supabase
    .from("production_operation")
    .select("*, operations(name, amount_per_piece)") // include operation master name if relationship exists
    .eq("production_id", productionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

/**
 * Assign worker and set pieces for a production operation.
 * If production_operation row exists (it should), update it.
 * Accepts productionId, operationId (production_operation id), workerId, piecesDone
 */
export const assignWorkerToOperation = async (
  productionId: string,
  operationRecordId: string,
  workerId: string | null,
  piecesDone: number | null,
  workerName?: string
) => {
  const updates: any = {};
  if (workerId !== undefined) updates.worker_id = workerId || null;
  if (workerName !== undefined) updates.worker_name = workerName || null;
  if (piecesDone !== undefined && piecesDone !== null) updates.pieces_done = piecesDone;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("production_operation")
    .update(updates)
    .eq("id", operationRecordId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Insert a new production_operation row for a production
 */
export const insertProductionOperation = async (payload: any) => {
  // expect snake_case keys matching DB: production_id, operation_id, worker_id, worker_name, pieces_done, earnings, date, created_at
  const { data, error } = await supabase
    .from("production_operation")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update production row
 */
export const updateProduction = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from("production")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};


