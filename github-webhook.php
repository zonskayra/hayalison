<?php
/**
 * GitHub Webhook Handler
 * 
 * Bu script, GitHub'daki değişiklikleri algılayıp canlı siteyi otomatik olarak günceller.
 * GitHub webhook ayarlarında bu dosyanın URL'sini belirtmeniz ve bir secret key tanımlamanız gerekir.
 */

// Hata raporlamayı etkinleştir
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log dosyası
$logFile = __DIR__ . '/github-webhook.log';

// GitHub webhook secret (GitHub webhook ayarlarında belirttiğiniz secret)
$secret = "YOUR_WEBHOOK_SECRET"; // Bu değeri kendi secret key'iniz ile değiştirin

// Log fonksiyonu
function writeLog($message) {
    global $logFile;
    $date = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$date] $message" . PHP_EOL, FILE_APPEND);
}

// Başlangıç log kaydı
writeLog("Webhook tetiklendi");

// Gelen payload'ı al
$payload = file_get_contents('php://input');

// Signature header'ı kontrol et
if (!isset($_SERVER['HTTP_X_HUB_SIGNATURE'])) {
    writeLog("Error: X-Hub-Signature header eksik");
    http_response_code(403);
    echo "Unauthorized: Signature header eksik";
    exit;
}

$signature = $_SERVER['HTTP_X_HUB_SIGNATURE'];

// Signature doğrulama
$hash = 'sha1=' . hash_hmac('sha1', $payload, $secret);
if (!hash_equals($hash, $signature)) {
    writeLog("Error: Signature doğrulama başarısız");
    http_response_code(403);
    echo "Unauthorized: Signature doğrulama başarısız";
    exit;
}

// JSON'ı decode et
$data = json_decode($payload, true);

// Event türünü kontrol et
$event = isset($_SERVER['HTTP_X_GITHUB_EVENT']) ? $_SERVER['HTTP_X_GITHUB_EVENT'] : '';
writeLog("Event: $event");

// Sadece push olaylarını işle
if ($event !== 'push') {
    writeLog("Bilgi: Push olayı değil, işlem yapılmadı");
    echo "No action needed: Not a push event";
    exit;
}

// Branch kontrolü
$ref = isset($data['ref']) ? $data['ref'] : '';
$branch = str_replace('refs/heads/', '', $ref);
writeLog("Branch: $branch");

// Sadece main branch'e push olaylarını işle
if ($branch !== 'main') {
    writeLog("Bilgi: main branch'e push değil, işlem yapılmadı");
    echo "No action needed: Not a push to main branch";
    exit;
}

// Değişen dosyaları kontrol et
$changedFiles = [];
if (isset($data['commits']) && is_array($data['commits'])) {
    foreach ($data['commits'] as $commit) {
        if (isset($commit['added']) && is_array($commit['added'])) {
            $changedFiles = array_merge($changedFiles, $commit['added']);
        }
        if (isset($commit['modified']) && is_array($commit['modified'])) {
            $changedFiles = array_merge($changedFiles, $commit['modified']);
        }
    }
}

// Finans verileri değişmiş mi kontrol et
$financeDataChanged = false;
foreach ($changedFiles as $file) {
    if ($file === 'finans/data/database.json') {
        $financeDataChanged = true;
        break;
    }
}

writeLog("Finans verileri değişti mi: " . ($financeDataChanged ? "Evet" : "Hayır"));

// Git pull komutunu çalıştır
$output = [];
$returnVar = 0;

// Site dizinini belirle (bu dosyanın bulunduğu dizin)
$siteDir = __DIR__;
writeLog("Site dizini: $siteDir");

// Git pull komutunu çalıştır
exec("cd $siteDir && git pull 2>&1", $output, $returnVar);
$outputText = implode("\n", $output);
writeLog("Git pull çıktısı: $outputText");

// Komut başarılı mı kontrol et
if ($returnVar !== 0) {
    writeLog("Error: Git pull başarısız oldu");
    http_response_code(500);
    echo "Error: Git pull failed";
    exit;
}

// Başarılı yanıt
writeLog("Başarılı: Site güncellendi");
echo "Success: Site updated successfully";

// Finans verileri değiştiyse, cache'i temizle
if ($financeDataChanged) {
    // Cache dosyasını temizle (varsa)
    $cacheFile = __DIR__ . '/finans/data/cache.json';
    if (file_exists($cacheFile)) {
        unlink($cacheFile);
        writeLog("Finans veri cache'i temizlendi");
    }
}