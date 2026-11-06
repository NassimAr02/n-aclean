<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/quote_rules.php';
require __DIR__ . '/quote_store.php';
require __DIR__ . '/mailer.php';

require_method('POST');
$input = read_json_body();

try {
    $quote = parse_quote($input);
} catch (InvalidArgumentException $error) {
    json_response(['error' => $error->getMessage()], 400);
}

try {
    insert_quote(db(), $quote);
} catch (Throwable $error) {
    error_log('Quote insert failed: ' . $error->getMessage());
    json_response(['error' => "Impossible d'enregistrer la demande."], 500);
}

try {
    send_quote_notification($quote, app_config());
} catch (Throwable $error) {
    error_log('Quote email failed: ' . $error->getMessage());
    json_response([
        'error' => "La demande est enregistrée mais la notification n'a pas pu être envoyée.",
    ], 502);
}

json_response(['ok' => true]);
