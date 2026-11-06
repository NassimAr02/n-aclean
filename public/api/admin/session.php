<?php
declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';
require __DIR__ . '/../admin_store.php';

require_method('GET');

$email = current_admin_email();
json_response([
    'authenticated' => $email !== null,
    'email' => $email,
    'needsSetup' => admin_count(db()) === 0,
]);
