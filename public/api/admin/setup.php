<?php
declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';
require __DIR__ . '/../admin_store.php';

require_method('POST');
$input = read_json_body();

$setupToken = app_config()['setup_token'];
if ($setupToken === '') {
    json_response(['error' => "La création du compte n'est pas activée."], 403);
}

$pdo = db();
if (admin_count($pdo) > 0) {
    json_response(['error' => 'Un compte administrateur existe déjà.'], 409);
}

$providedToken = is_string($input['setup_token'] ?? null) ? $input['setup_token'] : '';
if (!hash_equals($setupToken, $providedToken)) {
    json_response(['error' => "Le code d'activation est incorrect."], 403);
}

$email = is_string($input['email'] ?? null) ? strtolower(trim($input['email'])) : '';
if (mb_strlen($email) > 200 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    json_response(['error' => 'Merci de saisir une adresse email valide.'], 400);
}

$password = is_string($input['password'] ?? null) ? $input['password'] : '';
if (mb_strlen($password) < 10 || mb_strlen($password) > 200) {
    json_response(['error' => 'Le mot de passe doit contenir entre 10 et 200 caractères.'], 400);
}

$adminId = create_admin($pdo, $email, password_hash($password, PASSWORD_DEFAULT));
sign_in_admin($adminId, $email);
json_response(['authenticated' => true, 'email' => $email], 201);
