param(
    [switch]$NoNewWindows
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

$backendCommand = "Set-Location '$projectRoot'; ./.venv/Scripts/python.exe manage.py migrate; ./.venv/Scripts/python.exe manage.py runserver 0.0.0.0:8000"
$frontendCommand = "Set-Location '$projectRoot/frontend'; npm start -- --host 0.0.0.0 --port 4200"

if ($NoNewWindows) {
    Start-Job -Name "prompt-backend" -ScriptBlock {
        param($cmd)
        Invoke-Expression $cmd
    } -ArgumentList $backendCommand | Out-Null

    Start-Job -Name "prompt-frontend" -ScriptBlock {
        param($cmd)
        Invoke-Expression $cmd
    } -ArgumentList $frontendCommand | Out-Null

    Write-Host "Started background jobs: prompt-backend, prompt-frontend"
    Write-Host "Check with: Get-Job | Format-Table Id, Name, State"
    Write-Host "Stop with: Get-Job prompt-backend, prompt-frontend | Stop-Job"
}
else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand | Out-Null
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand | Out-Null

    Write-Host "Started backend and frontend in new PowerShell windows."
}

Write-Host "Frontend: http://localhost:4200"
Write-Host "Backend API: http://localhost:8000/prompts/"
