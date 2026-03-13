# Install Dependencies Script for Defence Incident Sentinel

# Set this to the folder where the repo is cloned.
$repoRoot = "C:\Users\benny\Downloads\Bennyhinn\SIH"

$directories = @(
    "$repoRoot\DefenceIncidentSentinel\user-registration\user-registration-backend",
    "$repoRoot\DefenceIncidentSentinel\user-dashboard\user-dashboard-backend",
    "$repoRoot\DefenceIncidentSentinel\user-registration\user-registration-frontend",
    "$repoRoot\DefenceIncidentSentinel\user-dashboard\user-dashboard-frontend",
    "$repoRoot\DefenceIncidentSentinel\cert-command-center\cert-command-center-frontend",
    "$repoRoot\DefenceIncidentSentinel\admin-dashboard\admin-dashboard-frontend"
)

Write-Host "--- Starting Dependency Installation ---" -ForegroundColor Cyan

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Write-Host "`nProcessing: $dir" -ForegroundColor Yellow
        Push-Location $dir
        
        Write-Host "  Running npm install..." -ForegroundColor Gray
        npm install
        
        Write-Host "  Running npm audit fix..." -ForegroundColor Gray
        npm audit fix
        
        Write-Host "  Running npm audit fix --force..." -ForegroundColor Gray
        npm audit fix --force
        
        Pop-Location
        Write-Host "  Completed." -ForegroundColor Green
    } else {
        Write-Host "`nError: Directory not found - $dir" -ForegroundColor Red
    }
}

Write-Host "`n--- All Installations Complete ---" -ForegroundColor Cyan
Write-Host "You can now run ./start_all.ps1 to start the services." -ForegroundColor Green
Read-Host -Prompt "Press Enter to exit"
