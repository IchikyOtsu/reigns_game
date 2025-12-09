"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

// --- Helper pour vérifier les droits Admin ---
async function checkAdmin() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error("Accès refusé : Vous devez être administrateur.");
    }
    return session;
}

// --- Actions Culture ---

export async function createCulture(formData: FormData) {
    await checkAdmin();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const color = formData.get("color") as string;
    const azgaarId = formData.get("azgaarId") ? parseInt(formData.get("azgaarId") as string) : null;

    const { error } = await supabaseAdmin
        .from("Culture")
        .insert({
            id: randomUUID(),
            name,
            description: description || null,
            color,
            azgaarId
        });

    if (error) {
        console.error("Erreur createCulture:", error);
        throw new Error("Erreur lors de la création de la culture: " + error.message);
    }

    revalidatePath("/dashboard/admin/countries/create");
    return { success: true };
}

// --- Actions Pays ---

export async function createCountry(formData: FormData) {
    await checkAdmin();

    const name = formData.get("name") as string;
    const capitalName = formData.get("capitalName") as string;
    const regimeId = formData.get("regimeId") as string;
    const cultureId = formData.get("cultureId") as string;
    const religionId = formData.get("religionId") as string || null;
    const playerId = formData.get("playerId") as string;
    const color = formData.get("color") as string;
    const areaKm2 = parseFloat(formData.get("areaKm2") as string);
    const population = parseInt(formData.get("population") as string);
    const emblem = formData.get("emblem") as string; // URL de l'image déjà uploadée

    // 1. Créer le Pays
    const { data: country, error: countryError } = await supabaseAdmin
        .from("Country")
        .insert({
            id: randomUUID(),
            name,
            regimeId,
            cultureId,
            religionId,
            playerId,
            color,
            areaKm2,
            population,
            emblem: emblem || null
        })
        .select()
        .single();

    if (countryError) {
        console.error("Erreur createCountry (Pays):", countryError);
        throw new Error("Erreur création pays: " + countryError.message);
    }

    // 2. Créer la Capitale (Ville)
    const { data: city, error: cityError } = await supabaseAdmin
        .from("City")
        .insert({
            id: randomUUID(),
            name: capitalName,
            countryId: country.id,
            isCapital: true,
            population: Math.floor(population / 10)
        })
        .select()
        .single();

    if (cityError) {
        // Idéalement on devrait rollback le pays ici, mais pour l'instant on log juste
        console.error("Erreur createCountry (Ville):", cityError);
        throw new Error("Erreur création capitale: " + cityError.message);
    }

    // 3. Mettre à jour le Pays avec l'ID de la Capitale
    const { error: updateError } = await supabaseAdmin
        .from("Country")
        .update({ capitalId: city.id })
        .eq("id", country.id);

    if (updateError) {
        throw new Error("Erreur liaison capitale: " + updateError.message);
    }

    revalidatePath("/dashboard/admin/users");
    return { success: true };
}

// --- Actions Province ---

export async function createProvince(formData: FormData) {
    await checkAdmin();

    const name = formData.get("name") as string;
    const countryId = formData.get("countryId") as string;
    const color = formData.get("color") as string;
    const azgaarId = formData.get("azgaarId") ? parseInt(formData.get("azgaarId") as string) : null;

    const { error } = await supabaseAdmin
        .from("Province")
        .insert({
            id: randomUUID(),
            name,
            countryId,
            color,
            azgaarId
        });

    if (error) {
        console.error("Erreur createProvince:", error);
        throw new Error("Erreur lors de la création de la province: " + error.message);
    }

    revalidatePath("/dashboard/admin/provinces/create");
    return { success: true };
}

// --- Actions Ville ---

export async function createCity(formData: FormData) {
    await checkAdmin();

    const name = formData.get("name") as string;
    const countryId = formData.get("countryId") as string;
    const provinceId = formData.get("provinceId") as string || null;
    const population = formData.get("population") ? parseInt(formData.get("population") as string) : null;
    const type = formData.get("type") as string || null;
    const azgaarId = formData.get("azgaarId") ? parseInt(formData.get("azgaarId") as string) : null;
    const isCapital = formData.get("isCapital") === "on";

    // Gestion des coordonnées
    const coordX = formData.get("coordX");
    const coordY = formData.get("coordY");
    let coordinates = null;
    if (coordX && coordY) {
        coordinates = { x: parseFloat(coordX as string), y: parseFloat(coordY as string) };
    }

    const { error } = await supabaseAdmin
        .from("City")
        .insert({
            id: randomUUID(),
            name,
            countryId,
            provinceId,
            population,
            type,
            azgaarId,
            isCapital,
            coordinates
        });

    if (error) {
        console.error("Erreur createCity:", error);
        throw new Error("Erreur lors de la création de la ville: " + error.message);
    }

    revalidatePath("/dashboard/admin/cities/create");
    return { success: true };
}
