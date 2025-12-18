import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CreateCultureForm from "./CreateCultureForm";
import CultureList from "./CultureList";

export default async function CreateCulturePage() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    // Fetch existing cultures
    const { data: cultures } = await supabaseAdmin
        .from('Culture')
        .select('*, type:CultureType(id, name)')
        .order('name');

    // Fetch culture types
    const { data: cultureTypes } = await supabaseAdmin
        .from('CultureType')
        .select('*')
        .order('name');

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Créer une Culture</h1>
                <p className="text-slate-600">Ajouter une nouvelle culture disponible pour les pays.</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl">
                <CreateCultureForm cultureTypes={cultureTypes || []} />
            </div>

            <CultureList cultures={cultures || []} cultureTypes={cultureTypes || []} />
        </div>
    );
}
