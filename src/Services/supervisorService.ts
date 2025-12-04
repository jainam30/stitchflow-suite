import { supabase } from "@/Config/supabaseClient";

export interface Supervisor {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
}

/**
 * Fetch all supervisors from the employees table (role='supervisor')
 */
export const getSupervisors = async (): Promise<Supervisor[]> => {
    try {
        const { data, error } = await supabase
            .from("employees")
            .select("*")
            .eq("role", "supervisor")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return (data || []).map((r: any) => ({
            id: r.id,
            name: r.name,
            email: r.email,
            isActive: r.is_active ?? true,
            createdAt: r.created_at ? new Date(r.created_at) : new Date(),
        }));
    } catch (err) {
        console.error("getSupervisors error:", err);
        return [];
    }
};

/**
 * Add a new supervisor to employees table with role='supervisor'
 */
export const addSupervisor = async (payload: {
    name: string;
    email?: string | null;
    employee_code?: string | null;
    mobile_number?: string | null;
    emergency_number?: string | null;
    current_address?: string | null;
    permanent_address?: string | null;
    id_proof?: string | null;
    id_proof_image_url?: string | null;
    bank_account_detail?: string | null; // JSON/stringified bank details
    bank_image_url?: string | null;
    salary_amount?: number | null;
    salary_id?: string | null;
    role?: string | null;
    is_supervisor?: boolean | null;
    profile_image_url?: string | null;
    is_active?: boolean | null;
}): Promise<{ data: Supervisor | null; error: any }> => {
    try {
        // map payload -> employees table columns per provided schema
        const insertRow: any = {
            name: payload.name,
            employee_code: payload.employee_code ?? null,
            email: payload.email ?? null,
            mobile_number: payload.mobile_number ?? null,
            emergency_number: payload.emergency_number ?? null,
            current_address: payload.current_address ?? null,
            permanent_address: payload.permanent_address ?? null,
            id_proof: payload.id_proof ?? null,
            id_proof_image_url: payload.id_proof_image_url ?? null,
            bank_account_detail: payload.bank_account_detail ?? null,
            bank_image_url: payload.bank_image_url ?? null,
            salary_amount: (typeof payload.salary_amount === "number") ? payload.salary_amount : null,
            salary_id: payload.salary_id ?? null,
            role: payload.role ?? "supervisor",
            is_supervisor: payload.is_supervisor ?? true,
            profile_image_url: payload.profile_image_url ?? null,
            is_active: payload.is_active ?? true,
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("employees")
            .insert([insertRow])
            .select()
            .single();

        if (error) {
            return { data: null, error };
        }

        return {
            data: {
                id: data.id,
                name: data.name,
                email: data.email,
                isActive: data.is_active ?? true,
                createdAt: data.created_at ? new Date(data.created_at) : new Date(),
            },
            error: null,
        };
    } catch (err) {
        return { data: null, error: err };
    }
};

/**
 * Update supervisor information in employees table
 */
export const updateSupervisor = async (id: string, payload: {
    name?: string;
    email?: string;
}): Promise<{ data: Supervisor | null; error: any }> => {
    try {
        const updates: any = {};
        if (payload.name) updates.name = payload.name;
        if (payload.email) updates.email = payload.email;

        const { data, error } = await supabase
            .from("employees")
            .update(updates)
            .eq("id", id)
            .eq("role", "supervisor")
            .select()
            .single();

        if (error) {
            return { data: null, error };
        }

        return {
            data: {
                id: data.id,
                name: data.name,
                email: data.email,
                isActive: data.is_active ?? true,
                createdAt: data.created_at ? new Date(data.created_at) : new Date(),
            },
            error: null,
        };
    } catch (err) {
        return { data: null, error: err };
    }
};

/**
 * Toggle supervisor active status in employees table
 */
export const toggleSupervisorStatus = async (id: string, isActive: boolean): Promise<{ data: Supervisor | null; error: any }> => {
    try {
        const { data, error } = await supabase
            .from("employees")
            .update({ is_active: !isActive })
            .eq("id", id)
            .eq("role", "supervisor")
            .select()
            .single();

        if (error) {
            return { data: null, error };
        }

        return {
            data: {
                id: data.id,
                name: data.name,
                email: data.email,
                isActive: data.is_active ?? true,
                createdAt: data.created_at ? new Date(data.created_at) : new Date(),
            },
            error: null,
        };
    } catch (err) {
        return { data: null, error: err };
    }
};

/**
 * Delete a supervisor from employees table
 */
export const deleteSupervisor = async (id: string): Promise<{ error: any }> => {
    try {
        const { error } = await supabase
            .from("employees")
            .delete()
            .eq("id", id)
            .eq("role", "supervisor");

        if (error) {
            return { error };
        }

        return { error: null };
    } catch (err) {
        return { error: err };
    }
};
