-- Création de la table Army
CREATE TABLE IF NOT EXISTS "Army" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "infantry" INTEGER NOT NULL DEFAULT 0,
    "archers" INTEGER NOT NULL DEFAULT 0,
    "cavalry" INTEGER NOT NULL DEFAULT 0,
    "artillery" INTEGER NOT NULL DEFAULT 0,
    "fleet" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Army_pkey" PRIMARY KEY ("id")
);

-- Création de l'index unique pour la relation One-to-One
CREATE UNIQUE INDEX IF NOT EXISTS "Army_countryId_key" ON "Army"("countryId");

-- Ajout de la contrainte de clé étrangère
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Army_countryId_fkey') THEN
        ALTER TABLE "Army" ADD CONSTRAINT "Army_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Initialisation des armées pour les pays existants (si pas d'armée)
INSERT INTO "Army" ("id", "countryId")
SELECT gen_random_uuid(), "id"
FROM "Country"
WHERE "id" NOT IN (SELECT "countryId" FROM "Army");
