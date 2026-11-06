<?php
declare(strict_types=1);

function insert_quote(PDO $pdo, array $quote): void
{
    $statement = $pdo->prepare(
        'INSERT INTO quote_requests
            (client_type, full_name, email, phone, city, services, property_type, surface_m2,
             preferred_date, message, company_name, siret, frequency)
         VALUES
            (:client_type, :full_name, :email, :phone, :city, :services, :property_type, :surface_m2,
             :preferred_date, :message, :company_name, :siret, :frequency)',
    );

    $statement->execute([
        'client_type' => $quote['client_type'],
        'full_name' => $quote['full_name'],
        'email' => $quote['email'],
        'phone' => $quote['phone'],
        'city' => $quote['city'],
        'services' => json_encode($quote['services'], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
        'property_type' => $quote['property_type'],
        'surface_m2' => $quote['surface_m2'],
        'preferred_date' => $quote['preferred_date'],
        'message' => $quote['message'],
        'company_name' => $quote['company_name'],
        'siret' => $quote['siret'],
        'frequency' => $quote['frequency'],
    ]);
}

function list_quotes(PDO $pdo): array
{
    $rows = $pdo->query(
        'SELECT id, client_type, full_name, email, phone, city, services, property_type, surface_m2,
                preferred_date, message, company_name, siret, frequency, created_at
         FROM quote_requests
         ORDER BY created_at DESC, id DESC',
    )->fetchAll();

    $utc = new DateTimeZone('UTC');
    return array_map(static function (array $row) use ($utc): array {
        return [
            'id' => (int) $row['id'],
            'client_type' => $row['client_type'],
            'full_name' => $row['full_name'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'city' => $row['city'],
            'services' => json_decode($row['services'], true, 16, JSON_THROW_ON_ERROR),
            'property_type' => $row['property_type'],
            'surface_m2' => $row['surface_m2'] === null ? null : (int) $row['surface_m2'],
            'preferred_date' => $row['preferred_date'],
            'message' => $row['message'],
            'company_name' => $row['company_name'],
            'siret' => $row['siret'],
            'frequency' => $row['frequency'],
            'created_at' => (new DateTimeImmutable($row['created_at'], $utc))->format(DATE_ATOM),
        ];
    }, $rows);
}
