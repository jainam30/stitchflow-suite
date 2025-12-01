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

    const isUuid = (v: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v);

    // If ids were provided -> update by id list
    if (Array.isArray(ids) && ids.length > 0) {
        const validIds = ids.filter(id => typeof id === 'string' && isUuid(id));
        if (validIds.length === 0) {
            return { data: [], error: { message: 'No valid UUID ids provided' } };
        }

        const { data, error } = await supabase
            .from('worker_salaries')
            .update(payload)
            .in('id', validIds)
            .select();

        console.log("SERVICE → update-by-ids returned:", { data, error });
        return { data, error };
    }

    // Otherwise, if workerId + month/year provided, update by worker_id and date range
    if (workerId && typeof month === 'number' && typeof year === 'number') {
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

        console.log("SERVICE → update-by-worker returned:", { data, error });
        return { data, error };
    }

    return { data: [], error: { message: 'No target provided for update' } };
};

export const getWorkerOperations = async (workerId: string, month?: number, year?: number) => {
    if (!workerId) return [];

    const isUuid = (v: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v);

    // build range if month+year provided
    let query = supabase.from("worker_salaries").select("*").eq("worker_id", workerId).order("date", { ascending: false });

    if (typeof month === "number" && typeof year === "number") {
        const from = new Date(year, month, 1).toISOString();
        const to = new Date(year, month + 1, 1).toISOString();
        query = query.gte("date", from).lt("date", to);
    }

    const { data, error } = await query;
    if (error) throw error;

    const rows = data || [];

    // fetch lookups for names / rate defaults
    const [{ data: products }, { data: operations }] = await Promise.all([
        supabase.from("products").select("id,name"),
        supabase.from("operations").select("id,name,amount_per_piece"),
    ]);

    const productMap: Record<string, any> = {};
    const opMap: Record<string, any> = {};
    (products || []).forEach((p: any) => { if (p?.id) productMap[p.id] = p; });
    (operations || []).forEach((o: any) => { if (o?.id) opMap[o.id] = o; });

    return (rows || []).map((r: any) => {
        const pieces = Number(r.pieces_done || 0);
        const rateFromRow = Number(r.amount_per_piece || 0);
        const opRate = opMap[r.operation_id]?.amount_per_piece;
        const rate = rateFromRow || Number(opRate || 0);
        const total = Number(r.total_amount ?? pieces * rate);

        return {
            id: r.id,
            productName: productMap[r.product_id]?.name || null,
            date: r.date ? new Date(r.date) : new Date(),
            pieces,
            ratePerPiece: rate,
            total,
        };
    });
};

export const getEmployeeSalaries = async () => {
    // Use schema-backed columns and order by created_at (exists on your table)
    const { data, error } = await supabase
        .from("employee_salaries")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = data || [];
    return (rows || []).map((r: any) => {
        // parse salary_month (expected to be text like "2023-04" or other human formats)
        const raw = r.salary_month;
        let monthDate: Date;
        if (typeof raw === "string") {
            // yyyy-mm or yyyy-mm-dd
            const isoMatch = raw.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
            if (isoMatch) {
                const y = Number(isoMatch[1]);
                const m = Math.max(0, Number(isoMatch[2]) - 1);
                const d = isoMatch[3] ? Number(isoMatch[3]) : 1;
                monthDate = new Date(y, m, d);
            } else {
                // fallback to Date constructor (handles "Apr 2023", etc.)
                monthDate = new Date(raw);
            }
        } else {
            monthDate = r.created_at ? new Date(r.created_at) : new Date();
        }

        return {
            id: r.id,
            employeeId: r.employee_id,
            employeeName: r.employee_name ?? null,
            month: monthDate,
            // map gross_salary -> salary for compatibility with UI type
            salary: Number(r.gross_salary ?? r.salary ?? 0),
            advance: Number(r.advance ?? 0),
            netSalary: Number(r.net_salary ?? 0),
            paid: !!r.paid,
            paidDate: r.paid_date ? new Date(r.paid_date) : undefined,
            paidBy: r.paid_by_employee_id || undefined,
        };
    });
};

export const markEmployeeSalariesPaid = async (ids?: string[], paidBy?: string) => {
    const payload: any = {
        paid: true,
        paid_date: new Date().toISOString(),
    };
    if (paidBy) payload.paid_by_employee_id = paidBy;

    const isUuid = (v: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v);

    if (Array.isArray(ids) && ids.length > 0) {
        const validIds = ids.filter(id => typeof id === 'string' && isUuid(id));
        if (validIds.length === 0) {
            return { data: [], error: { message: 'No valid UUID ids provided' } };
        }

        const { data, error } = await supabase
            .from('employee_salaries')
            .update(payload)
            .in('id', validIds)
            .select();

        return { data, error };
    }

    return { data: [], error: { message: 'No target provided for update' } };
};

export const getEmployees = async () => {
    // Single safe fetch: select all columns and normalize any salary-like field client-side.
    try {
        const { data, error } = await supabase.from("employees").select("*");
        if (error) {
            console.warn("getEmployees: failed selecting employees:", error);
            return [];
        }

        return (data || []).map((r: any) => {
            const base =
                (typeof r.base_salary === "number" ? r.base_salary : undefined) ??
                (typeof r.basic_salary === "number" ? r.basic_salary : undefined) ??
                (typeof r.gross_salary === "number" ? r.gross_salary : undefined) ??
                (typeof r.salary === "number" ? r.salary : undefined) ??
                (typeof r.baseSalary === "number" ? r.baseSalary : undefined);

            return {
                id: r.id,
                name: r.name,
                base_salary: typeof base === "number" ? base : undefined,
            };
        });
    } catch (err) {
        console.warn("getEmployees fallback error:", err);
        return [];
    }
};

/**
 * Insert a new employee salary row into employee_salaries.
 * Accepts employeeId, salaryMonth (Date | string), grossSalary, advance, netSalary, paid (opt), employeeName (opt).
 * Returns { data, error }.
 */
export const createEmployeeSalary = async (payload: {
    employeeId: string;
    salaryMonth: Date | string;
    grossSalary?: number;
    advance?: number;
    netSalary?: number;
    paid?: boolean;
    paidDate?: Date | string | null;
    employeeName?: string | null;
}) => {
    const fmtMonth = (m: Date | string) => {
        if (m instanceof Date) {
            return `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}`;
        }
        const str = String(m);
        const isoMatch = str.match(/^(\d{4})-(\d{2})/);
        if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}`;
        const dt = new Date(str);
        return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    };

    const body: any = {
        employee_id: payload.employeeId,
        salary_month: fmtMonth(payload.salaryMonth),
        gross_salary: payload.grossSalary ?? 0,
        advance: payload.advance ?? 0,
        net_salary: payload.netSalary ?? 0,
        paid: !!payload.paid,
        paid_date: payload.paidDate ? (payload.paidDate instanceof Date ? payload.paidDate.toISOString() : payload.paidDate) : null,
        employee_name: payload.employeeName ?? null,
    };

    const { data, error } = await supabase
        .from("employee_salaries")
        .insert([body])
        .select();

    // friendly unique-constraint error handling
    if (error) {
        const msg = String(error.message || "").toLowerCase();
        if (msg.includes("unique") || String(error.details || "").toLowerCase().includes("unique")) {
            return { data: null, error: { message: "A salary for this employee and month already exists." } };
        }
        return { data: null, error };
    }

    return { data, error: null };
};

export const updateEmployeeSalary = async (id: string, updates: {
    salaryMonth?: Date | string;
    grossSalary?: number;
    advance?: number;
    netSalary?: number;
    paid?: boolean;
    paidDate?: Date | string | null;
    employeeName?: string | null;
}) => {
    if (!id) return { data: null, error: { message: "Missing id" } };

    const fmtMonth = (m?: Date | string) => {
        if (!m) return undefined;
        if (m instanceof Date) return `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}`;
        const str = String(m);
        const isoMatch = str.match(/^(\d{4})-(\d{2})/);
        if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}`;
        const dt = new Date(str);
        return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    };

    const payload: any = {};
    if (typeof updates.grossSalary === "number") payload.gross_salary = updates.grossSalary;
    if (typeof updates.advance === "number") payload.advance = updates.advance;
    if (typeof updates.netSalary === "number") payload.net_salary = updates.netSalary;
    if (typeof updates.paid === "boolean") payload.paid = updates.paid;
    if (updates.paidDate) payload.paid_date = updates.paidDate instanceof Date ? updates.paidDate.toISOString() : updates.paidDate;
    if (typeof updates.employeeName === "string") payload.employee_name = updates.employeeName;
    const formattedMonth = fmtMonth(updates.salaryMonth);
    if (formattedMonth) payload.salary_month = formattedMonth;

    const { data, error } = await supabase
        .from("employee_salaries")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) {
        return { data: null, error };
    }

    return { data, error: null };
};

export const addWorkerSalary = async (payload: {
    worker_id: string | null;
    product_id?: string | null;
    operation_id?: string | null;
    pieces_done?: number;
    amount_per_piece?: number;
    total_amount?: number;
    date?: string | Date;
    created_by?: string | null;
}) => {
    const body: any = {
        worker_id: payload.worker_id,
        product_id: payload.product_id ?? null,
        operation_id: payload.operation_id ?? null,
        pieces_done: Number(payload.pieces_done ?? 0),
        amount_per_piece: Number(payload.amount_per_piece ?? 0),
        total_amount: typeof payload.total_amount === "number"
            ? payload.total_amount
            : (Number(payload.pieces_done ?? 0) * Number(payload.amount_per_piece ?? 0)),
        date: payload.date ? (payload.date instanceof Date ? payload.date.toISOString() : String(payload.date)) : new Date().toISOString(),
        paid: false,
        paid_date: null,
        created_at: new Date().toISOString(),
    };

    try {
        const { data, error } = await supabase
            .from("worker_salaries")
            .insert([body])
            .select()
            .single();

        if (error) {
            // Return friendly error shape (caller handles logging/toast)
            return { data: null, error };
        }
        return { data, error: null };
    } catch (err: any) {
        return { data: null, error: err };
    }
};
