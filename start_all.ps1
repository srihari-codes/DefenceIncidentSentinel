# Start All Services Script for Defence Incident Sentinel

$services = @(
    @{ name = "Registration Backend (Port 4000)"; path = "d:\checking\user-registration\user-registration-backend"; command = "npm start"; port = 4000 },
    @{ name = "Dashboard Backend (Port 4001)"; path = "d:\checking\user-dashboard\user-dashboard-backend"; command = "npm start"; port = 4001 },
    @{ name = "Registration Frontend (Port 5173)"; path = "d:\checking\user-registration\user-registration-frontend"; command = "npm run dev"; port = 5173 },
    @{ name = "Dashboard Frontend (Port 5174)"; path = "d:\checking\user-dashboard\user-dashboard-frontend"; command = "npm run dev"; port = 5174 },
    @{ name = "CERT Command Center (Port 5175)"; path = "d:\checking\cert-command-center\cert-command-center-frontend"; command = "npm run dev"; port = 5175 },
    @{ name = "Admin Dashboard (Port 5176)"; path = "d:\checking\admin-dashboard\admin-dashboard-frontend"; command = "npm run dev"; port = 5176 }
)

Write-Host "--- Port Cleanup ---" -ForegroundColor Yellow
foreach ($service in $services) {
    $connections = Get-NetTCPConnection -LocalPort $service.port -ErrorAction SilentlyContinue
    if ($connections) {
        Write-Host "Port $($service.port) is in use. Terminating existing process..." -ForegroundColor Gray
        $pids = $connections.OwningProcess | Select-Object -Unique
        foreach ($procId in $pids) {
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        }
    }
}
Write-Host "Cleanup complete.`n" -ForegroundColor Green

foreach ($service in $services) {
    Write-Host "Starting $($service.name)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $($service.path); $($service.command)"
}

Write-Host "`nAll services have been launched in separate windows." -ForegroundColor Green
Write-Host "Registration: http://localhost:5173"
Write-Host "Dashboard: http://localhost:5174"
Write-Host "CERT Command Center: http://localhost:5175"
Write-Host "Admin Dashboard: http://localhost:5176"
