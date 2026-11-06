<?php
declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';
require __DIR__ . '/../quote_store.php';

require_method('GET');
require_admin();

try {
    json_response(['requests' => list_quotes(db())]);
} catch (Throwable $error) {
    error_log('Quote list failed: ' . $error->getMessage());
    json_response(['error' => 'Impossible de charger les demandes.'], 500);
}
