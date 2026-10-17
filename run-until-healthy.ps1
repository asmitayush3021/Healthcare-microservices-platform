#!/usr/bin/env pwsh
# run-until-healthy.ps1
# Starts all services and retries until every service is healthy/running.

$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ProjectDir

$MaxAttempts = 5
$Attempt = 0

function Write-Color($msg, $color = "White") {
    Write-Host $msg -ForegroundColor $color
}

function Get-UnhealthyServices {
    $output = docker compose ps --format json 2>&1
    $services = $output | Where-Object { $_ -match '^\{' } | ForEach-Object { $_ | ConvertFrom-Json }
    $unhealthy = @()
    foreach ($svc in $services) {
        $state  = $svc.State  ?? $svc.status ?? ""
        $health = $svc.Health ?? $svc.health ?? ""
        # A service is "ok" if it is running and either has no health check or is healthy
        if ($state -notmatch "running" -or ($health -ne "" -and $health -ne "healthy")) {
            $unhealthy += [PSCustomObject]@{ Name = $svc.Service ?? $svc.name; State = $state; Health = $health }
        }
    }
    return $unhealthy
}

Write-Color "============================================" "Cyan"
Write-Color " Healthcare Microservices - Docker Launcher " "Cyan"
Write-Color "============================================" "Cyan"
Write-Color ""

while ($Attempt -lt $MaxAttempts) {
    $Attempt++
    Write-Color ">>> Attempt $Attempt / $MaxAttempts  --  $(Get-Date -Format 'HH:mm:ss')" "Yellow"

    # Pull / build & start all services detached
    Write-Color "Starting services with 'docker compose up -d --build' ..." "Cyan"
    docker compose up -d --build 2>&1 | ForEach-Object { Write-Host $_ }

    if ($LASTEXITCODE -ne 0) {
        Write-Color "docker compose up failed (exit $LASTEXITCODE). Will retry..." "Red"
        Start-Sleep -Seconds 15
        continue
    }

    # Wait up to 5 minutes for services to become healthy
    $WaitSec   = 0
    $TimeoutSec = 300

    Write-Color "Waiting for all services to become healthy (timeout ${TimeoutSec}s)..." "Cyan"

    while ($WaitSec -lt $TimeoutSec) {
        Start-Sleep -Seconds 15
        $WaitSec += 15

        $bad = Get-UnhealthyServices

        if ($bad.Count -eq 0) {
            Write-Color ""
            Write-Color "✅  All services are UP and HEALTHY!" "Green"
            Write-Color ""
            docker compose ps
            exit 0
        }

        Write-Color "  [${WaitSec}s] Still waiting on: $($bad | ForEach-Object { "$($_.Name)($($_.State)/$($_.Health))" } | Join-String -Separator ', ')" "Yellow"
    }

    Write-Color "Timeout reached. Some services are still unhealthy:" "Red"
    $bad | ForEach-Object { Write-Color "  - $($_.Name): state=$($_.State)  health=$($_.Health)" "Red" }

    if ($Attempt -lt $MaxAttempts) {
        Write-Color "Bringing stack down and retrying from scratch..." "Yellow"
        docker compose down --remove-orphans 2>&1 | Out-Null
        Start-Sleep -Seconds 10
    }
}

Write-Color ""
Write-Color "❌  Failed to bring all services healthy after $MaxAttempts attempt(s)." "Red"
Write-Color "Check logs with:  docker compose logs -f" "Yellow"
docker compose ps
exit 1
