# Skrip Pelayan Tempatan Misi Nombor Arab (PowerShell)
$ports = @(8080, 8081, 8082, 3000, 5000)
$listener = $null
$activePort = $null

foreach ($p in $ports) {
    try {
        $tempListener = New-Object System.Net.HttpListener
        $tempListener.Prefixes.Add("http://localhost:$p/")
        $tempListener.Start()
        $listener = $tempListener
        $activePort = $p
        break
    } catch {
        if ($tempListener) { 
            try { $tempListener.Close() } catch {}
        }
    }
}

if (-not $listener) {
    Write-Host "Ralat: Tidak dapat mengikat port tempatan (Port 8080-8082 mungkin sedang digunakan oleh aplikasi lain)." -ForegroundColor Red
    Write-Host "Sila tutup sebarang aplikasi lain yang menggunakan port 8080 dan cuba lagi."
    pause
    exit 1
}

$rootDir = $PSScriptRoot
if ([string]::IsNullOrEmpty($rootDir)) {
    $rootDir = (Get-Location).Path
}

try {
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host "    MISI NOMBOR ARAB : KELAS 1 GAMMA" -ForegroundColor Yellow
    Write-Host "    Pelayan web aktif di http://localhost:$activePort/" -ForegroundColor Green
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host "Sila biarkan tetingkap ini terbuka semasa bermain." -ForegroundColor Gray
    Write-Host "Tekan Ctrl + C untuk keluar.`n" -ForegroundColor Gray

    # Buka pelayar web secara automatik
    Start-Process "http://localhost:$activePort/"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $rawPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($rawPath)) { $rawPath = 'index.html' }
        $localPath = Join-Path $rootDir $rawPath

        if (Test-Path $localPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $contentType = switch ($ext) {
                '.html' { 'text/html; charset=utf-8' }
                '.js'   { 'application/javascript; charset=utf-8' }
                '.css'  { 'text/css; charset=utf-8' }
                '.json' { 'application/json; charset=utf-8' }
                '.png'  { 'image/png' }
                '.jpg'  { 'image/jpeg' }
                default { 'application/octet-stream' }
            }
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Tidak Ditemui: $rawPath")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
} finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
    }
    if ($listener) {
        $listener.Close()
    }
}
