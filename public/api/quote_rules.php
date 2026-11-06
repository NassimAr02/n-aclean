<?php
declare(strict_types=1);

const QUOTE_COMMUNES = [
    'Achenheim', 'Bischheim', 'Blaesheim', 'Breuschwickersheim', 'Eckbolsheim', 'Eckwersheim',
    'Entzheim', 'Eschau', 'Fegersheim', 'Geispolsheim', 'Hangenbieten', 'Hœnheim', 'Holtzheim',
    'Illkirch-Graffenstaden', 'Kolbsheim', 'La Wantzenau', 'Lampertheim', 'Lingolsheim', 'Lipsheim',
    'Mittelhausbergen', 'Mundolsheim', 'Niederhausbergen', 'Oberhausbergen', 'Oberschaeffolsheim',
    'Osthoffen', 'Ostwald', 'Plobsheim', 'Reichstett', 'Schiltigheim', 'Souffelweyersheim',
    'Strasbourg', 'Vendenheim', 'Wolfisheim',
];

const QUOTE_SERVICES = [
    'Vitres et vitrines',
    'Bureaux et espaces communs',
    'Remise en état après déménagement',
];

const QUOTE_PROPERTY_LABELS = [
    'appartement' => 'Appartement',
    'maison' => 'Maison',
    'bureaux' => 'Bureaux',
    'commerce' => 'Commerce ou boutique',
    'espaces_communs' => 'Espaces communs (immeuble, copropriété)',
    'locaux_activite' => "Local d'activité",
    'autre' => 'Autre',
];

const QUOTE_FREQUENCY_LABELS = [
    'ponctuelle' => 'Ponctuelle (une seule fois)',
    'hebdomadaire' => 'Chaque semaine',
    'bihebdomadaire' => 'Deux fois par semaine',
    'quotidienne' => 'Chaque jour',
    'mensuelle' => 'Chaque mois',
    'a_definir' => 'Je ne sais pas encore',
];

function text_value(mixed $value, int $min, int $max): ?string
{
    if (!is_string($value)) {
        return null;
    }
    $trimmed = trim($value);
    $length = mb_strlen($trimmed);
    return $length >= $min && $length <= $max ? $trimmed : null;
}

function optional_text_value(mixed $value, int $max): ?string
{
    if ($value === null || $value === '') {
        return null;
    }
    return text_value($value, 1, $max);
}

function one_of(mixed $value, array $allowed): ?string
{
    return is_string($value) && in_array($value, $allowed, true) ? $value : null;
}

function is_valid_iso_date(string $value): bool
{
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
        return false;
    }
    [$year, $month, $day] = array_map('intval', explode('-', $value));
    return checkdate($month, $day, $year);
}

// Valide toute la demande côté serveur. Lève InvalidArgumentException avec un message destiné à l'utilisateur.
function parse_quote(array $input): array
{
    $clientType = one_of($input['client_type'] ?? null, ['particulier', 'professionnel']);
    if ($clientType === null) {
        throw new InvalidArgumentException('Type de demande invalide.');
    }

    $fullName = text_value($input['full_name'] ?? null, 2, 120);
    if ($fullName === null) {
        throw new InvalidArgumentException('Le nom est invalide.');
    }

    $email = text_value($input['email'] ?? null, 5, 200);
    if ($email === null || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        throw new InvalidArgumentException("L'adresse e-mail est invalide.");
    }

    $phone = text_value($input['phone'] ?? null, 6, 30);
    if ($phone === null) {
        throw new InvalidArgumentException('Le téléphone est invalide.');
    }

    $city = one_of($input['city'] ?? null, QUOTE_COMMUNES);
    if ($city === null) {
        throw new InvalidArgumentException("La commune n'est pas dans la zone d'intervention.");
    }

    $services = $input['services'] ?? null;
    if (!is_array($services) || count($services) < 1 || count($services) > 3) {
        throw new InvalidArgumentException('Les prestations sont invalides.');
    }
    $validServices = [];
    foreach ($services as $service) {
        $validService = one_of($service, QUOTE_SERVICES);
        if ($validService === null) {
            throw new InvalidArgumentException('Les prestations sont invalides.');
        }
        $validServices[] = $validService;
    }

    $propertyType = null;
    if (($input['property_type'] ?? null) !== null && $input['property_type'] !== '') {
        $propertyType = one_of($input['property_type'], array_keys(QUOTE_PROPERTY_LABELS));
        if ($propertyType === null) {
            throw new InvalidArgumentException('Le type de logement ou de locaux est invalide.');
        }
    }

    $surface = null;
    if (($input['surface_m2'] ?? null) !== null) {
        $rawSurface = $input['surface_m2'];
        if (!is_int($rawSurface) || $rawSurface < 1 || $rawSurface > 100000) {
            throw new InvalidArgumentException('La surface est invalide.');
        }
        $surface = $rawSurface;
    }

    $preferredDate = null;
    if (!empty($input['preferred_date'])) {
        if (!is_string($input['preferred_date']) || !is_valid_iso_date($input['preferred_date'])) {
            throw new InvalidArgumentException('La date souhaitée est invalide.');
        }
        $preferredDate = $input['preferred_date'];
    }

    $message = optional_text_value($input['message'] ?? null, 2000);

    $companyName = null;
    $siret = null;
    $frequency = null;
    if ($clientType === 'professionnel') {
        $companyName = text_value($input['company_name'] ?? null, 2, 160);
        if ($companyName === null) {
            throw new InvalidArgumentException("Le nom de l'entreprise est requis.");
        }

        $rawSiret = is_string($input['siret'] ?? null) ? preg_replace('/\s/', '', $input['siret']) : '';
        if ($rawSiret !== '') {
            if (!preg_match('/^\d{14}$/', $rawSiret)) {
                throw new InvalidArgumentException('Le numéro SIRET est invalide.');
            }
            $siret = $rawSiret;
        }

        $frequency = one_of($input['frequency'] ?? null, array_keys(QUOTE_FREQUENCY_LABELS));
        if ($frequency === null) {
            throw new InvalidArgumentException('La fréquence souhaitée est invalide.');
        }
    }

    return [
        'client_type' => $clientType,
        'full_name' => $fullName,
        'email' => $email,
        'phone' => $phone,
        'city' => $city,
        'services' => $validServices,
        'property_type' => $propertyType,
        'surface_m2' => $surface,
        'preferred_date' => $preferredDate,
        'message' => $message,
        'company_name' => $companyName,
        'siret' => $siret,
        'frequency' => $frequency,
    ];
}
