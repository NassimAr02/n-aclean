<?php
declare(strict_types=1);

function admin_count(PDO $pdo): int
{
    return (int) $pdo->query('SELECT COUNT(*) AS total FROM admins')->fetch()['total'];
}

function find_admin_by_email(PDO $pdo, string $email): ?array
{
    $statement = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1');
    $statement->execute(['email' => $email]);
    $row = $statement->fetch();
    return $row === false ? null : $row;
}

function create_admin(PDO $pdo, string $email, string $passwordHash): int
{
    $statement = $pdo->prepare('INSERT INTO admins (email, password_hash) VALUES (:email, :password_hash)');
    $statement->execute(['email' => $email, 'password_hash' => $passwordHash]);
    return (int) $pdo->lastInsertId();
}
