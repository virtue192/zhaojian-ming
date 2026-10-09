$ErrorActionPreference = 'Stop'
$appDirectory = $PSScriptRoot
$localUrl = 'http://127.0.0.1:4187'
Add-Type -AssemblyName System.Net.Http
$localHandler = New-Object System.Net.Http.HttpClientHandler
$localHandler.UseProxy = $false
$localClient = New-Object System.Net.Http.HttpClient($localHandler)
$localClient.Timeout = [TimeSpan]::FromSeconds(2)
function Get-LocalHealth {
    $localClient.GetStringAsync("$localUrl/api/health").GetAwaiter().GetResult() | ConvertFrom-Json
}
$ready = $false
try {
    $health = Get-LocalHealth
    if ($health.ok -and $health.app -eq 'zhaojian-ming') { $ready = $true }
} catch { }
if (-not $ready) {
    $nodePath = (Get-Command node -ErrorAction Stop).Source
    $runtimeDirectory = Join-Path $appDirectory '.runtime'
    New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
    $serverPath = Join-Path $appDirectory 'server.mjs'
    $previousPort = $env:PORT
    try {
        $env:PORT = '4187'
        $process = Start-Process -FilePath $nodePath -ArgumentList ('"' + $serverPath + '"') -WorkingDirectory $appDirectory -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $runtimeDirectory 'server.log') -RedirectStandardError (Join-Path $runtimeDirectory 'server-error.log')
    } finally { $env:PORT = $previousPort }
    Set-Content -LiteralPath (Join-Path $runtimeDirectory 'server.pid') -Value $process.Id
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        Start-Sleep -Milliseconds 200
        try { $health = Get-LocalHealth; if ($health.ok -and $health.app -eq 'zhaojian-ming') { $ready = $true; break } } catch { }
        if ($process.HasExited) { break }
    }
}
$localClient.Dispose()
if (-not $ready) { throw 'Unable to start Zhaojian. Check Node.js and whether port 4187 is occupied.' }
Start-Process $localUrl
