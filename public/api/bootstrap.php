<?php
declare(strict_types=1);

const ADMIN_SESSION_IDLE_SECONDS = 7200;

function app_config(): array
{
    return require __DIR__ . '/config.php';
}

function json_response(array $body, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}

function require_method(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        json_response(['error' => 'Méthode non autorisée.'], 405);
    }
}

// Exiger du JSON bloque les envois de formulaires venant d'autres sites (protection CSRF).
function read_json_body(): array
{
    $contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
    if (!str_starts_with($contentType, 'application/json')) {
        json_response(['error' => 'Requête invalide.'], 400);
    }

    $raw = file_get_contents('php://input', false, null, 0, 65536);
    try {
        $data = json_decode($raw === false ? '' : $raw, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        json_response(['error' => 'Requête invalide.'], 400);
    }

    if (!is_array($data) || array_is_list($data)) {
        json_response(['error' => 'Requête invalide.'], 400);
    }

    return $data;
}

function db(): PDO
{
    $db = app_config()['db'];
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $db['host'], $db['name']);

    return new PDO($dsn, $db['user'], $db['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET time_zone = '+00:00'",
    ]);
}

function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name('nacleansid');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => ($_SERVER['HTTPS'] ?? '') === 'on',
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function current_admin_email(): ?string
{
    start_admin_session();

    $lastSeen = $_SESSION['last_seen'] ?? 0;
    if (!isset($_SESSION['admin_id']) || time() - $lastSeen > ADMIN_SESSION_IDLE_SECONDS) {
        $_SESSION = [];
        return null;
    }

    $_SESSION['last_seen'] = time();
    return $_SESSION['admin_email'] ?? null;
}

function require_admin(): void
{
    if (current_admin_email() === null) {
        json_response(['error' => 'Connexion requise.'], 401);
    }
}

function sign_in_admin(int $adminId, string $email): void
{
    start_admin_session();
    session_regenerate_id(true);
    $_SESSION['admin_id'] = $adminId;
    $_SESSION['admin_email'] = $email;
    $_SESSION['last_seen'] = time();
}
