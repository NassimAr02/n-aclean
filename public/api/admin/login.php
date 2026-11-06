<?php
declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';
require __DIR__ . '/../admin_store.php';

require_method('POST');
$input = read_json_body();

$email = is_string($input['email'] ?? null) ? strtolower(trim($input['email'])) : '';
$password = is_string($input['password'] ?? null) ? $input['password'] : '';
if ($email === '' || $password === '') {
    json_response(['error' => 'Email et mot de passe requis.'], 400);
}

$admin = find_admin_by_email(db(), $email);
if ($admin === null || !password_verify($password, $admin['password_hash'])) {
    usleep(800000);
    json_response(['error' => 'Email ou mot de passe incorrect.'], 401);
}

sign_in_admin((int) $admin['id'], $admin['email']);
json_response(['authenticated' => true, 'email' => $admin['email']]);
