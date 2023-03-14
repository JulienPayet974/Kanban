-- CREATION D'UN JEU DE DONNES DE BASE POUR NOTRE BDD

BEGIN;

-- LIST

INSERT INTO "list" ("name", "position")
VALUES ('première liste', 1);

INSERT INTO "list" ("name", "position")
VALUES ('deuxième liste', 2);

-- INSERT INTO "list" ("name", "position")
-- VALUES ("première liste", 1), ("deuxième liste", 2);

-- CARD

INSERT INTO "card" ("content", "color", "position", "list_id")
VALUES ('carte 1', '#000000', 1, 1), 
('carte 2', '#FF0000', 2, 1), 
('carte 3', '#00FF00', 3, 1),
('carte 4', '#FF0000', 1, 2), 
('carte 5', '#00FF00', 2, 2);


-- TAG
INSERT INTO "tag" ("name")
VALUES ('urgent'),
('non prioritaire '),
('moyennement prioritaire');


-- CARD_HAS_TAG
INSERT INTO "card_has_tag" ("card_id", "tag_id")
VALUES (1, 1),
(1, 2),
(2, 3),
(3, 3);


COMMIT;