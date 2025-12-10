import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CreateEventForm from "./CreateEventForm";
import EventList from "./EventList";

export default async function CreateEventPage() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user.role !== 'ADMIN') {
    redirect("/dashboard");
  }

  const { data: countries } = await supabaseAdmin
    .from('Country')
    .select('id, name')
    .order('name');

  const { data: bonusTypes } = await supabaseAdmin
    .from('BonusType')
    .select('id, name, description')
    .order('name');

  // Fetch existing events with bonuses
  const { data: events } = await supabaseAdmin
    .from('Event')
    .select(`
      id, name, description, countryId, createdAt,
      isActive, activeFor,
      country:Country(name),
      bonuses:EventBonus(id, modifierValue, bonusType:BonusType(name))
    `)
    .order('createdAt', { ascending: false });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Créer un Événement</h1>
        <p className="text-slate-600">Associez un pays et ajoutez plusieurs bonus.</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <CreateEventForm 
          countries={countries || []} 
          bonusTypes={bonusTypes || []}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Événements ({events?.length || 0})</h2>
        </div>
        <EventList events={events || []} bonusTypes={bonusTypes || []} />
      </div>
    </div>
  );
}
