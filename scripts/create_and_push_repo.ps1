<#
.SYNOPSIS
  Cria o repositório no GitHub e empurra o código local.

USAGE
  PS> .\scripts\create_and_push_repo.ps1 -RepoOwner AmaralCharle -RepoName DroneExpressfull

NOTAS
  - Se o `gh` (GitHub CLI) estiver instalado e autenticado, o script usará ele.
  - Se `GITHUB_TOKEN` estiver definido no ambiente, o script usará a API REST para criar o repo.
  - Caso contrário, o script prepara o repositório local e adiciona o remote HTTPS, mas não cria o repo remoto.
#>

param(
    [string]$RepoOwner = "AmaralCharle",
    [string]$RepoName = "DroneExpressfull",
    [switch]$Private
)

function Exec([string]$cmd) {
    Write-Host "> $cmd"
    $res = iex $cmd 2>&1
    return $LASTEXITCODE
}

Push-Location "$PSScriptRoot/.."

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "git não encontrado. Instale o Git e execute novamente."
    exit 1
}

if (-not (Test-Path .git)) {
    Write-Host "Inicializando repositório git local..."
    git init
    git branch -M main
    git add -A
    git commit -m "Initial commit" 2>$null || Write-Host "Commit já existente ou sem alterações"
} else {
    Write-Host ".git já existe. Pulando inicialização."
}

$remoteUrl = "https://github.com/$RepoOwner/$RepoName.git"

$created = $false

if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "gh encontrado. Verificando autenticação..."
    gh auth status 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "gh autenticado. Criando repositório com gh..."
        $flags = "--public"
        if ($Private) { $flags = "--private" }
        gh repo create "$RepoOwner/$RepoName" $flags --source=. --remote=origin --push --confirm
        if ($LASTEXITCODE -eq 0) { $created = $true }
    } else {
        Write-Host "gh não autenticado. Pule para usar GITHUB_TOKEN ou criar manualmente via web."    
    }
}

if (-not $created -and $env:GITHUB_TOKEN) {
    Write-Host "Tentando criar repositório via API REST usando GITHUB_TOKEN..."
    $body = @{ name = $RepoName; private = [bool]$Private }
    $json = $body | ConvertTo-Json
    try {
        $hdr = @{ Authorization = "token $env:GITHUB_TOKEN"; Accept = 'application/vnd.github+json' }
        $resp = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $hdr -Body $json -ContentType 'application/json'
        if ($resp.full_name) { Write-Host "Repositório criado: $($resp.full_name)"; $created = $true }
    } catch {
        Write-Warning "Falha ao criar repo via API: $_"
    }
}

if (-not $created) {
    Write-Host "Não foi possível criar o repo remotamente automaticamente. Vou configurar o remote HTTPS localmente e você pode criar o repo manualmente no GitHub."    
    git remote remove origin 2>$null || $null
    git remote add origin $remoteUrl
    Write-Host "Remote configurado: $remoteUrl"
    Write-Host "Por favor, crie o repositório no GitHub (https://github.com/new) com nome $RepoName e dê push: git push -u origin main"
    Pop-Location
    exit 0
}

Write-Host "Remote e push automático tentados. Verificando remotes..."
git remote remove origin 2>$null || $null
git remote add origin $remoteUrl 2>$null || $null

Write-Host "Fazendo push para origin/main..."
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Warning "Push falhou. Verifique permissões ou se o repositório remoto existe."    
} else {
    Write-Host "Push concluído com sucesso. Repositório disponível em: https://github.com/$RepoOwner/$RepoName"
}

Pop-Location
