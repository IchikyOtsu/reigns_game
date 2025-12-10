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
    const typeId = formData.get("typeId") as string;
    const cellCount = formData.get("cellCount") ? parseInt(formData.get("cellCount") as string) : null;
    const expansionFactor = formData.get("expansionFactor") ? parseFloat(formData.get("expansionFactor") as string) : null;
    const areaKm2 = formData.get("areaKm2") ? parseFloat(formData.get("areaKm2") as string) : null;
    const population = formData.get("population") ? parseInt(formData.get("population") as string) : null;

    const { error } = await supabaseAdmin
        .from("Culture")
        .insert({
            id: randomUUID(),
            name,
            description: description || null,
            color,
            typeId: typeId || null,
            cellCount,
            expansionFactor,
            areaKm2,
            population
        });

    if (error) {
        console.error("Erreur createCulture:", error);
        throw new Error("Erreur lors de la création de la culture: " + error.message);
    }

    revalidatePath("/dashboard/admin/cultures/create");
    return { success: true };
}

export async function updateCulture(formData: FormData) {
    await checkAdmin();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const color = formData.get("color") as string;
    const typeId = formData.get("typeId") as string;
    const cellCount = formData.get("cellCount") ? parseInt(formData.get("cellCount") as string) : null;
    const expansionFactor = formData.get("expansionFactor") ? parseFloat(formData.get("expansionFactor") as string) : null;
    const areaKm2 = formData.get("areaKm2") ? parseFloat(formData.get("areaKm2") as string) : null;
    const population = formData.get("population") ? parseInt(formData.get("population") as string) : null;

    const { error } = await supabaseAdmin
        .from("Culture")
        .update({
            name,
            description: description || null,
            color,
            typeId: typeId || null,
            cellCount,
            expansionFactor,
            areaKm2,
            population
        })
        .eq("id", id);

    if (error) {
        console.error("Erreur updateCulture:", error);
        throw new Error("Erreur lors de la modification de la culture: " + error.message);
    }

    revalidatePath("/dashboard/admin/cultures/create");
    return { success: true };
}

// --- Actions Pays ---

export async function createCountry(formData: FormData) {
    await checkAdmin();

    const name = formData.get("name") as string;
    const capitalName = formData.get("capitalName") as string;
    const capitalProvinceName = formData.get("capitalProvinceName") as string;
    const regimeId = formData.get("regimeId") as string;
    const cultureId = formData.get("cultureId") as string;
    const religionId = formData.get("religionId") as string || null;
    const playerId = formData.get("playerId") as string;
    const color = formData.get("color") as string;
    const areaKm2 = parseFloat(formData.get("areaKm2") as string);
    const population = parseInt(formData.get("population") as string);
    const emblem = formData.get("emblem") as string; // URL de l'image déjà uploadée
    const stabilityBase = formData.get("stabilityBase") ? parseFloat(formData.get("stabilityBase") as string) : 0.5;
    const fatigue = formData.get("fatigue") ? parseFloat(formData.get("fatigue") as string) : 0.0;

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
            emblem: emblem || null,
            stabilityBase,
            fatigue
        })
        .select()
        .single();

    if (countryError) {
        console.error("Erreur createCountry (Pays):", countryError);
        throw new Error("Erreur création pays: " + countryError.message);
    }

    // 2. Créer la Province de la Capitale
    const { data: province, error: provinceError } = await supabaseAdmin
        .from("Province")
        .insert({
            id: randomUUID(),
            name: capitalProvinceName,
            countryId: country.id,
            color: color // On utilise la couleur du pays par défaut
        })
        .select()
        .single();

    if (provinceError) {
        console.error("Erreur createCountry (Province):", provinceError);
        // On ne bloque pas tout pour ça, mais c'est gênant
    }

    // 3. Créer la Capitale (Ville)
    const { data: city, error: cityError } = await supabaseAdmin
        .from("City")
        .insert({
            id: randomUUID(),
            name: capitalName,
            countryId: country.id,
            provinceId: province?.id || null,
            isCapital: true,
            population: Math.floor(population / 10),
            type: "Capitale"
        })
        .select()
        .single();

    if (cityError) {
        // Idéalement on devrait rollback le pays ici, mais pour l'instant on log juste
        console.error("Erreur createCountry (Ville):", cityError);
        throw new Error("Erreur création capitale: " + cityError.message);
    }

    // 4. Mettre à jour le Pays avec l'ID de la Capitale
    const { error: updateError } = await supabaseAdmin
        .from("Country")
        .update({ capitalId: city.id })
        .eq("id", country.id);

    if (updateError) {
        throw new Error("Erreur liaison capitale: " + updateError.message);
    }

    revalidatePath("/dashboard/admin/countries/create");
    return { success: true };
}

export async function updateCountry(formData: FormData) {
    await checkAdmin();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const regimeId = formData.get("regimeId") as string;
    const cultureId = formData.get("cultureId") as string;
    const religionId = formData.get("religionId") as string || null;
    const playerId = formData.get("playerId") as string;
    const color = formData.get("color") as string;
    const areaKm2 = parseFloat(formData.get("areaKm2") as string);
    const population = parseInt(formData.get("population") as string);
    const emblem = formData.get("emblem") as string;
    const capitalId = formData.get("capitalId") as string;
    const stabilityBase = formData.get("stabilityBase") ? parseFloat(formData.get("stabilityBase") as string) : undefined;
    const fatigue = formData.get("fatigue") ? parseFloat(formData.get("fatigue") as string) : undefined;

    const updateData: any = {
        name,
        regimeId,
        cultureId,
        religionId,
        playerId,
        color,
        areaKm2,
        population
    };

    if (typeof stabilityBase !== 'undefined') {
        updateData.stabilityBase = stabilityBase;
    }
    if (typeof fatigue !== 'undefined') {
        updateData.fatigue = fatigue;
    }

    if (emblem) {
        updateData.emblem = emblem;
    }

    // Gestion du changement de capitale
    if (capitalId) {
        // Récupérer l'ancienne capitale
        const { data: currentCountry } = await supabaseAdmin
            .from("Country")
            .select("capitalId")
            .eq("id", id)
            .single();

        if (currentCountry && currentCountry.capitalId !== capitalId) {
            // 1. Enlever le statut de l'ancienne capitale
            if (currentCountry.capitalId) {
                await supabaseAdmin
                    .from("City")
                    .update({ isCapital: false, type: 'Ville' })
                    .eq("id", currentCountry.capitalId);
            }

            // 2. Mettre le statut à la nouvelle capitale
            await supabaseAdmin
                .from("City")
                .update({ isCapital: true, type: 'Capitale' })
                .eq("id", capitalId);

            // 3. Mettre à jour le champ capitalId du pays
            updateData.capitalId = capitalId;
        }
    }

    const { error } = await supabaseAdmin
        .from("Country")
        .update(updateData)
        .eq("id", id);

    if (error) {
        console.error("Erreur updateCountry:", error);
        throw new Error("Erreur lors de la modification du pays: " + error.message);
    }

    revalidatePath("/dashboard/admin/countries/create");
    return { success: true };
}

// --- Actions Province ---

export async function createProvince(formData: FormData) {
    await checkAdmin();

    const name = formData.get("name") as string;
    const countryId = formData.get("countryId") as string;
    const color = formData.get("color") as string;
    const emblem = formData.get("emblem") as string;
    const areaKm2 = formData.get("areaKm2") ? parseFloat(formData.get("areaKm2") as string) : null;
    const population = formData.get("population") ? parseInt(formData.get("population") as string) : null;
    const biomesJson = formData.get("biomes") as string;

    const provinceId = randomUUID();

    const { error } = await supabaseAdmin
        .from("Province")
        .insert({
            id: provinceId,
            name,
            countryId,
            color,
            emblem: emblem || null,
            areaKm2,
            population
        });

    if (error) {
        console.error("Erreur createProvince:", error);
        throw new Error("Erreur lors de la création de la province: " + error.message);
    }

    // Gestion des biomes
    if (biomesJson) {
        try {
            const biomes = JSON.parse(biomesJson);
            if (Array.isArray(biomes) && biomes.length > 0) {
                const provinceBiomes = biomes.map((b: any) => ({
                    id: randomUUID(),
                    provinceId: provinceId,
                    biomeId: b.biomeId,
                    cellCount: Number(b.cellCount)
                }));

                const { error: biomesError } = await supabaseAdmin
                    .from("ProvinceBiome")
                    .insert(provinceBiomes);

                if (biomesError) {
                    console.error("Erreur createProvince (Biomes):", biomesError);
                    // On ne bloque pas, mais on log
                }
            }
        } catch (e) {
            console.error("Erreur parsing biomes JSON:", e);
        }
    }

    revalidatePath("/dashboard/admin/provinces/create");
    return { success: true };
}

export async function updateProvince(formData: FormData) {
    await checkAdmin();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const countryId = formData.get("countryId") as string;
    const color = formData.get("color") as string;
    const emblem = formData.get("emblem") as string;
    const areaKm2 = formData.get("areaKm2") ? parseFloat(formData.get("areaKm2") as string) : null;
    const population = formData.get("population") ? parseInt(formData.get("population") as string) : null;
    const biomesJson = formData.get("biomes") as string;

    const { error } = await supabaseAdmin
        .from("Province")
        .update({
            name,
            countryId,
            color,
            emblem: emblem || null,
            areaKm2,
            population
        })
        .eq("id", id);

    if (error) {
        console.error("Erreur updateProvince:", error);
        throw new Error("Erreur lors de la modification de la province: " + error.message);
    }

    // Gestion des biomes (Suppression et recréation)
    if (biomesJson) {
        try {
            // 1. Supprimer les anciens biomes
            const { error: deleteError } = await supabaseAdmin
                .from("ProvinceBiome")
                .delete()
                .eq("provinceId", id);

            if (deleteError) {
                console.error("Erreur updateProvince (Delete Biomes):", deleteError);
            }

            // 2. Insérer les nouveaux biomes
            const biomes = JSON.parse(biomesJson);
            if (Array.isArray(biomes) && biomes.length > 0) {
                const provinceBiomes = biomes.map((b: any) => ({
                    id: randomUUID(),
                    provinceId: id,
                    biomeId: b.biomeId,
                    cellCount: Number(b.cellCount)
                }));

                const { error: insertError } = await supabaseAdmin
                    .from("ProvinceBiome")
                    .insert(provinceBiomes);

                if (insertError) {
                    console.error("Erreur updateProvince (Insert Biomes):", insertError);
                }
            }
        } catch (e) {
            console.error("Erreur parsing biomes JSON:", e);
        }
    }

    revalidatePath("/dashboard/admin/provinces/create");
    return { success: true };
}

// --- Actions Ville ---

export async function createCity(formData: FormData) {
    await checkAdmin();

    const name = formData.get("name") as string;
    const countryId = formData.get("countryId") as string;
    const provinceId = formData.get("provinceId") as string; // Required now
    const population = formData.get("population") ? parseInt(formData.get("population") as string) : null;
    const isCapital = formData.get("isCapital") === "on";

    const isPort = formData.get("isPort") === "on";
    const isWalled = formData.get("isWalled") === "on";
    const hasCitadel = formData.get("hasCitadel") === "on";
    const hasMarketplace = formData.get("hasMarketplace") === "on";
    const hasReligiousCenter = formData.get("hasReligiousCenter") === "on";
    const hasShanty = formData.get("hasShanty") === "on";

    if (!provinceId) {
        throw new Error("La province est obligatoire pour créer une ville.");
    }

    const cityId = randomUUID();

    const { error } = await supabaseAdmin
        .from("City")
        .insert({
            id: cityId,
            name,
            countryId,
            provinceId,
            population,
            isCapital,
            isPort,
            isWalled,
            hasCitadel,
            hasMarketplace,
            hasReligiousCenter,
            hasShanty
        });

    if (error) {
        console.error("Erreur createCity:", error);
        throw new Error("Erreur lors de la création de la ville: " + error.message);
    }

    // Si c'est une capitale, on met à jour le pays
    if (isCapital) {
        const { error: updateError } = await supabaseAdmin
            .from("Country")
            .update({ capitalId: cityId })
            .eq("id", countryId);

        if (updateError) {
            console.error("Erreur updateCountry (Capital):", updateError);
            // On ne bloque pas, mais c'est un problème
        }
    }

    revalidatePath("/dashboard/admin/cities/create");
    return { success: true };
}

export async function updateCity(formData: FormData) {
    await checkAdmin();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const countryId = formData.get("countryId") as string;
    const provinceId = formData.get("provinceId") as string;
    const population = formData.get("population") ? parseInt(formData.get("population") as string) : null;
    const isCapital = formData.get("isCapital") === "on";

    const isPort = formData.get("isPort") === "on";
    const isWalled = formData.get("isWalled") === "on";
    const hasCitadel = formData.get("hasCitadel") === "on";
    const hasMarketplace = formData.get("hasMarketplace") === "on";
    const hasReligiousCenter = formData.get("hasReligiousCenter") === "on";
    const hasShanty = formData.get("hasShanty") === "on";

    if (!provinceId) {
        throw new Error("La province est obligatoire.");
    }

    const { error } = await supabaseAdmin
        .from("City")
        .update({
            name,
            countryId,
            provinceId,
            population,
            isCapital,
            isPort,
            isWalled,
            hasCitadel,
            hasMarketplace,
            hasReligiousCenter,
            hasShanty
        })
        .eq("id", id);

    if (error) {
        console.error("Erreur updateCity:", error);
        throw new Error("Erreur lors de la modification de la ville: " + error.message);
    }

    // Si c'est une capitale, on met à jour le pays
    if (isCapital) {
        const { error: updateError } = await supabaseAdmin
            .from("Country")
            .update({ capitalId: id })
            .eq("id", countryId);

        if (updateError) {
            console.error("Erreur updateCountry (Capital):", updateError);
        }
    }

    revalidatePath("/dashboard/admin/cities/create");
    return { success: true };
}

// --- Actions Religion ---

export async function createReligion(formData: FormData) {
    await checkAdmin();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const color = formData.get("color") as string;
    const typeId = formData.get("typeId") as string;
    const formId = formData.get("formId") as string;
    const deityName = formData.get("deityName") as string;
    const potential = formData.get("potential") as string;
    const areaKm2 = formData.get("areaKm2") ? parseFloat(formData.get("areaKm2") as string) : null;
    const followers = formData.get("followers") ? parseInt(formData.get("followers") as string) : null;
    const expansionFactor = formData.get("expansionFactor") ? parseFloat(formData.get("expansionFactor") as string) : null;

    const { error } = await supabaseAdmin
        .from("Religion")
        .insert({
            id: randomUUID(),
            name,
            description: description || null,
            color,
            typeId: typeId || null,
            formId: formId || null,
            deityName: deityName || null,
            potential: potential || null,
            areaKm2,
            followers,
            expansionFactor
        });

    if (error) {
        console.error("Erreur createReligion:", error);
        throw new Error("Erreur lors de la création de la religion: " + error.message);
    }

    revalidatePath("/dashboard/admin/religions/create");
    return { success: true };
}

export async function updateReligion(formData: FormData) {
    await checkAdmin();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const color = formData.get("color") as string;
    const typeId = formData.get("typeId") as string;
    const formId = formData.get("formId") as string;
    const deityName = formData.get("deityName") as string;
    const potential = formData.get("potential") as string;
    const areaKm2 = formData.get("areaKm2") ? parseFloat(formData.get("areaKm2") as string) : null;
    const followers = formData.get("followers") ? parseInt(formData.get("followers") as string) : null;
    const expansionFactor = formData.get("expansionFactor") ? parseFloat(formData.get("expansionFactor") as string) : null;

    const { error } = await supabaseAdmin
        .from("Religion")
        .update({
            name,
            description: description || null,
            color,
            typeId: typeId || null,
            formId: formId || null,
            deityName: deityName || null,
            potential: potential || null,
            areaKm2,
            followers,
            expansionFactor
        })
        .eq("id", id);

    if (error) {
        console.error("Erreur updateReligion:", error);
        throw new Error("Erreur lors de la modification de la religion: " + error.message);
    }

    revalidatePath("/dashboard/admin/religions/create");
    return { success: true };
}
