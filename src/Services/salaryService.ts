import { supabase } from "@/Config/supabaseClient";

export const getWorkerSalaries = async () => {
  const { data, error } = await supabase
    .from("worker_salaries")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;

  const rows = data || [];

  // fetch lookups
  const [{ data: workers }, { data: products }, { data: operations }] = await Promise.all([
    supabase.from("workers").select("id,name"),
    supabase.from("products").select("id,name"),
    supabase.from("operations").select("id,name,amount_per_piece"),
  ]);

  const workerMap: Record<string, any> = {};
  const productMap: Record<string, any> = {};
  const opMap: Record<string, any> = {};

  (workers || []).forEach((w: any) => { if (w && w.id) workerMap[w.id] = w; });
  (products || []).forEach((p: any) => { if (p && p.id) productMap[p.id] = p; });
  (operations || []).forEach((o: any) => { if (o && o.id) opMap[o.id] = o; });

  return (rows || []).map((r: any) => ({
    id: r.id,
    workerId: r.worker_id,
    workerName: workerMap[r.worker_id]?.name || null,
    productId: r.product_id,
    productName: productMap[r.product_id]?.name || null,
    date: r.date ? new Date(r.date) : new Date(),
    operationId: r.operation_id,
    operationName: opMap[r.operation_id]?.name || null,
    piecesDone: Number(r.pieces_done || 0),
    amountPerPiece: Number(r.amount_per_piece || 0),
    totalAmount: Number(r.total_amount || 0),
    paid: !!r.paid,
    paidDate: r.paid_date ? new Date(r.paid_date) : undefined,
    paidBy: r.paid_by_employee_id || undefined,
  }));
};

export const markWorkerSalariesPaid = async (
  ids?: string[],
  paidBy?: string,
  workerId?: string,
  month?: number,
  year?: number
) => {
  const payload: any = {
    paid: true,
    paid_date: new Date().toISOString(),
  };
  if (paidBy) payload.paid_by_employee_id = paidBy;

  // Helper: simple UUID v4-ish check
  const isUuid = (v: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v);

  // If ids provided and all look like UUIDs, update by id list
  if (ids && ids.length > 0) {
    const validIds = ids.filter((x) => isUuid(x));
    if (validIds.length > 0) {
      // If some ids were invalid, skip them and update only valid UUIDs
      const { data, error } = await supabase
        .from('worker_salaries')
        .update(payload)
        .in('id', validIds)
        .select();

      return { data, error };
    }
    // if no valid uuid ids provided, continue to workerId path (fallback)
  }

  // Otherwise, if workerId + month/year provided, update by worker_id and date range
  if (workerId && typeof month === 'number' && typeof year === 'number') {
    // If workerId is not a UUID, abort to avoid invalid uuid errors in Postgres
    if (!isUuid(workerId)) {
      return { data: [], error: { message: 'workerId is not a UUID; aborting update to avoid DB error' } };
    }
    const from = new Date(year, month, 1).toISOString();
    const to = new Date(year, month + 1, 1).toISOString();

    const { data, error } = await supabase
      .from('worker_salaries')
      .update(payload)
      .eq('worker_id', workerId)
      .gte('date', from)
      .lt('date', to)
      .select();

    return { data, error };
  }

  // Fallback: nothing to do
  return { data: [], error: null };
};
