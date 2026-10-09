$ErrorActionPreference = 'Stop'
$pidFile = Join-Path $PSScriptRoot '.runtime/server.pid'
if (-not (Test-Path -LiteralPath $pidFile)) { Write-Host 'No launcher-owned server was found.'; exit }
$taskProcessId = [int](Get-Content -LiteralPath $pidFile)
$processInfo = Get-CimInstance Win32_Process -Filter "ProcessId = $taskProcessId"
$expectedServer = Join-Path $PSScriptRoot 'server.mjs'
if ($processInfo -and $processInfo.Name -eq 'node.exe' -and $processInfo.CommandLine.Contains($expectedServer)) {
    Stop-Process -Id $taskProcessId
    Remove-Item -LiteralPath $pidFile
    Write-Host 'Zhaojian server stopped.'
} else { Write-Host 'The saved process is no longer this app. No process was stopped.' }
