<?php
declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
read_json_body();

start_admin_session();
$_SESSION = [];
session_destroy();

json_response(['authenticated' => false]);
