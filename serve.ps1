$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:$port/")
$listener.Start()

Write-Host ""
Write-Host "  Сервер запущен!" -ForegroundColor Green
Write-Host "  Локально:  http://localhost:$port" -ForegroundColor Cyan
Write-Host "  С телефона: http://192.168.0.107:$port" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Нажми Ctrl+C чтобы остановить" -ForegroundColor Gray
Write-Host ""

$mimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response

  $path = $req.Url.LocalPath
  if ($path -eq '/') { $path = '/index.html' }
  $file = Join-Path $root $path.TrimStart('/')

  if (Test-Path $file -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($file)
    $mime = if ($mimeTypes[$ext]) { $mimeTypes[$ext] } else { 'application/octet-stream' }
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $res.ContentType = $mime
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    Write-Host "  200  $($req.Url.LocalPath)" -ForegroundColor DarkGray
  } else {
    $res.StatusCode = 404
    $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
    $res.OutputStream.Write($msg, 0, $msg.Length)
    Write-Host "  404  $($req.Url.LocalPath)" -ForegroundColor Red
  }

  $res.OutputStream.Close()
}
