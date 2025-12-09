import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CreateReligionForm from "./CreateReligionForm";
import ReligionList from "./ReligionList";

export default async function CreateReligionPage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    // Fetch existing religions
    const { data: religions } = await supabaseAdmin
        .from('Religion')
        .select('*, type:ReligionType(id, name), form:ReligionForm(id, name)')
        .order('name');

    // Fetch religion types
    const { data: religionTypes } = await supabaseAdmin
        .from('ReligionType')
        .select('*')
        .order('name');

    // Fetch religion forms
    const { data: religionForms } = await supabaseAdmin
        .from('ReligionForm')
        .select('*')
        .order('name');

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Gestion des Religions</h1>
                <p className="text-slate-600">Créer et visualiser les religions.</p>
            </header>

            <CreateReligionForm
                religionTypes={religionTypes || []}
                religionForms={religionForms || []}
            />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">Liste des Religions ({religions?.length || 0})</h2>
                </div>
                <ReligionList
                    religions={religions || []}
                    religionTypes={religionTypes || []}
                    religionForms={religionForms || []}
                />
            </div>
        </div>
    );
}
