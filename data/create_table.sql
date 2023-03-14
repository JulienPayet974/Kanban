BEGIN;

-- SUPPRIMER LES TABLES A CREER SI ELLES EXISTENT

DROP TABLE IF EXISTS "list", "card", "tag", "card_has_tag";
-- DROP SEQUENCE IF EXISTS "list_id_seq", "card_id_seq", "tag_id_seq";

-- CREATION DES TABLES

CREATE TABLE "list" (
  "id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- GENERATED ALWAYS AS IDENTITY permet de laisser le SGBD gérer la valeur pour ce champs
  "name" TEXT NOT NULL,
  "position" SMALLINT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);


CREATE TABLE "card" (
  "id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "list_id" INTEGER NOT NULL REFERENCES "list"("id") ON DELETE CASCADE, -- si la liste 12 est supprimée alors, tous les enregistrements de la table carte avec la valeur 12 pour le champ list_id sont automatiquement supprimés. en savoir plus : https://www.postgresql.org/docs/current/ddl-constraints.html
  "content" TEXT NOT NULL,
  "color" VARCHAR(30),
  "position" SMALLINT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "tag" (
 "id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 "name" TEXT NOT NULL,
 "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMPTZ
);

CREATE TABLE  "card_has_tag" (
  "tag_id" INTEGER NOT NULL REFERENCES "tag"("id") ON DELETE CASCADE,
  "card_id" INTEGER NOT NULL REFERENCES "card"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("tag_id", "card_id") -- on aurait aussi pu faire PRIARY KEY ("tag_id", "card_id")
);

COMMIT;