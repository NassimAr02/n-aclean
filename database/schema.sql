-- N&A Clean : schema MySQL / MariaDB pour phpMyAdmin (Hostinger)
--
-- 1. Créer ou choisir une base vide dans hPanel (Bases de données MySQL).
-- 2. Ouvrir phpMyAdmin, sélectionner cette base, onglet "Importer", choisir ce fichier.
--
-- Tables :
--   quote_requests : une ligne par demande de devis (particuliers et professionnels).
--   admins         : comptes autorisés à consulter l'espace administration.
--
-- Les mots de passe ne sont jamais stockés en clair : seul un hash bcrypt est enregistré.

CREATE TABLE IF NOT EXISTS quote_requests (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_type ENUM('particulier', 'professionnel') NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  city VARCHAR(60) NOT NULL,
  services JSON NOT NULL,
  property_type ENUM('appartement', 'maison', 'bureaux', 'commerce', 'espaces_communs', 'locaux_activite', 'autre') NULL,
  surface_m2 INT UNSIGNED NULL,
  preferred_date DATE NULL,
  message TEXT NULL,
  company_name VARCHAR(160) NULL,
  siret CHAR(14) NULL,
  frequency ENUM('ponctuelle', 'hebdomadaire', 'bihebdomadaire', 'quotidienne', 'mensuelle', 'a_definir') NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_quote_requests_created_at (created_at),
  KEY idx_quote_requests_client_type (client_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(200) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
