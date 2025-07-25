# Script de configuration de l'application Intranet
# equivalent PowerShell du script bash

# Nettoyer l'environnement
if (Test-Path ".env") {
    Remove-Item ".env" -Force
}
Clear-Host

Write-Host ""
Write-Host "========================================================================"
Write-Host "               Configuration de l'application Intranet                  "
Write-Host "========================================================================"
Write-Host ""

Write-Host "Ce script vous guide dans la configuration de l'environnement :"
Write-Host ""
Write-Host "=> Mode developpement (utilisant Docker)"
Write-Host "  - Requiert Docker et Docker Compose installes sur votre machine."
Write-Host "  - Inclut le hot reloading et les outils de developpement"
Write-Host ""
Write-Host "=> Mode production (utilisant Docker)"
Write-Host "  - Requiert Docker et Docker Compose installes sur votre machine."
Write-Host "  - Version optimisee pour la production"
Write-Host ""

# Demander le mode de demarrage
$devMode = Read-Host "Souhaitez-vous demarrer en mode developpement ? (o/N)"

# Verifier si le fichier .env.example existe
if (-not (Test-Path ".env.example")) {
    Write-Host "Erreur: Le fichier .env.example n'existe pas" -ForegroundColor Red
    Write-Host "   Veuillez creer ce fichier avant de continuer" -ForegroundColor Red
}

# Copier le fichier d'exemple
Copy-Item ".env.example" ".env"
$envFile = ".env"

# Demander l'URL de l'application
$domain = Read-Host "Quel est l'URL de l'application (ex: https://intranet.example.com ou https://192.168.1.1:8443) ?"

# Generer un mot de passe securise pour la base de donnees

# Alternative PowerShell a openssl rand -base64 16
$bytes = New-Object byte[] 16
$rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
$rng.GetBytes($bytes)
$DB_PASSWORD = [Convert]::ToBase64String($bytes)
$rng.Dispose()

# Lire le contenu du fichier .env
$envContent = Get-Content $envFile

# Remplacer les valeurs dans le fichier .env
$envContent = $envContent -replace '^VITE_API_URL=.*', "VITE_API_URL=$domain/api"
$envContent = $envContent -replace '^DB_PASSWORD=.*', "DB_PASSWORD=$DB_PASSWORD"

# ecrire le contenu modifie
$envContent | Set-Content $envFile -Encoding UTF8

Write-Host ""
Write-Host "Configuration terminee :" -ForegroundColor Green
Write-Host "- URL de l'application: $domain" -ForegroundColor Cyan
Write-Host "- URL de l'API: $domain/api" -ForegroundColor Cyan
Write-Host "- Mot de passe de la base de donnees genere automatiquement" -ForegroundColor Cyan
Write-Host ""

# Verifier si Docker est disponible
try {
    $dockerVersion = docker --version 2>$null
    if (-not $dockerVersion) {
        throw "Docker non trouve"
    }
} catch {
    Write-Host "Erreur: Docker n'est pas installe ou n'est pas accessible" -ForegroundColor Red
    Write-Host "   Veuillez installer Docker Desktop pour Windows" -ForegroundColor Red
}

# Verifier si Docker Compose est disponible
try {
    $composeVersion = docker compose version 2>$null
    if (-not $composeVersion) {
        throw "Docker Compose non trouve"
    }
} catch {
    Write-Host "Erreur: Docker Compose n'est pas disponible" -ForegroundColor Red
    Write-Host "   Veuillez vous assurer que Docker Desktop est installe avec Compose" -ForegroundColor Red
}

Write-Host ""
Read-Host "Appuyez sur Entree pour continuer..."

if ($devMode -match '^[oOyY]$') {
    Write-Host "Lancement en mode developpement avec le hot reloading..." -ForegroundColor Yellow
    Write-Host "   Acces a l'application: $domain" -ForegroundColor Cyan
    Write-Host "   Acces a phpMyAdmin: http://localhost:8080" -ForegroundColor Cyan
    Write-Host ""
    
    try {
        & docker compose --profile=dev up --watch
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "Application demarree en mode developpement" -ForegroundColor Green
            Write-Host "   Pour voir les logs: docker compose --profile=dev logs -f" -ForegroundColor Cyan
            Write-Host "   Pour arreter: docker compose --profile=dev down" -ForegroundColor Cyan
        } else {
            Write-Host "Erreur lors du demarrage de l'application" -ForegroundColor Red
        }
    } catch {
        Write-Host "Erreur lors de l'execution de Docker Compose: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Lancement en mode production..." -ForegroundColor Yellow
    Write-Host "   Acces a l'application: $domain" -ForegroundColor Cyan
    Write-Host ""
    
    try {
        & docker compose --profile=prod up --build -d
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "Application demarree en mode production" -ForegroundColor Green
            Write-Host "   Pour voir les logs: docker compose --profile=prod logs -f" -ForegroundColor Cyan
            Write-Host "   Pour arrêter: docker compose --profile=prod down" -ForegroundColor Cyan
        } else {
            Write-Host "Erreur lors du demarrage de l'application" -ForegroundColor Red
        }
    } catch {
        Write-Host "Erreur lors de l'execution de Docker Compose: $($_.Exception.Message)" -ForegroundColor Red
    }
}


Write-Host ""
Write-Host "Note: Vous pouvez modifier le fichier .env pour personnaliser la configuration" -ForegroundColor Yellow
Read-Host "Appuyez sur Entree pour quitter..."