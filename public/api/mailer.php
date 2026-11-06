<?php
declare(strict_types=1);

function send_quote_notification(array $quote, array $config): void
{
    $apiKey = $config['resend_api_key'];
    $recipient = $config['quote_recipient_email'];
    if ($apiKey === '' || $recipient === '') {
        throw new RuntimeException('Email configuration missing');
    }

    $isPro = $quote['client_type'] === 'professionnel';
    $label = $isPro ? 'professionnel' : 'particulier';
    $rows = quote_email_rows($quote);

    $htmlRows = '';
    foreach ($rows as [$key, $value]) {
        $htmlRows .= '<tr><td style="padding:8px 12px;color:#475569;vertical-align:top;white-space:nowrap">'
            . htmlspecialchars($key, ENT_QUOTES) . '</td><td style="padding:8px 12px;color:#0f172a;white-space:pre-wrap">'
            . htmlspecialchars($value, ENT_QUOTES) . '</td></tr>';
    }

    $textBody = implode("\n", array_map(static fn (array $row): string => "{$row[0]} : {$row[1]}", $rows));
    $payload = json_encode([
        'from' => $config['mail_from'],
        'to' => [$recipient],
        'reply_to' => $quote['email'],
        'subject' => "Nouvelle demande de devis ({$label}) : {$quote['full_name']}",
        'html' => '<div style="font-family:Arial,sans-serif"><h2 style="color:#0f766e">Nouvelle demande de devis '
            . $label . '</h2><table style="border-collapse:collapse;width:100%">' . $htmlRows . '</table></div>',
        'text' => $textBody,
    ], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);

    $curl = curl_init('https://api.resend.com/emails');
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => ["Authorization: Bearer {$apiKey}", 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
    ]);
    curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $error = curl_error($curl);
    curl_close($curl);

    if ($error !== '' || $status < 200 || $status >= 300) {
        throw new RuntimeException("Resend responded with status {$status} {$error}");
    }
}

function quote_email_rows(array $quote): array
{
    $isPro = $quote['client_type'] === 'professionnel';
    $rows = [];
    if ($isPro) {
        $rows[] = ['Entreprise', $quote['company_name'] ?? ''];
        if ($quote['siret']) {
            $rows[] = ['SIRET', $quote['siret']];
        }
    }
    $rows[] = [$isPro ? 'Personne à contacter' : 'Nom', $quote['full_name']];
    $rows[] = ['E-mail', $quote['email']];
    $rows[] = ['Téléphone', $quote['phone']];
    $rows[] = ['Commune', $quote['city']];
    if ($quote['property_type']) {
        $rows[] = [
            $isPro ? 'Type de locaux' : 'Type de logement',
            QUOTE_PROPERTY_LABELS[$quote['property_type']] ?? $quote['property_type'],
        ];
    }
    if ($quote['frequency']) {
        $rows[] = ['Fréquence', QUOTE_FREQUENCY_LABELS[$quote['frequency']] ?? $quote['frequency']];
    }
    $rows[] = ['Prestations', implode(', ', $quote['services'])];
    if ($quote['surface_m2']) {
        $rows[] = ['Surface', $quote['surface_m2'] . ' m²'];
    }
    if ($quote['preferred_date']) {
        $rows[] = ['Date souhaitée', $quote['preferred_date']];
    }
    if ($quote['message']) {
        $rows[] = ['Précisions', $quote['message']];
    }
    return $rows;
}
