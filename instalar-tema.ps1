# instalar-tema.ps1
# Copia o tema WordPress para o site criado no Local by WP Engine
# Execute: .\instalar-tema.ps1 (depois de criar o site no Local)

$nomeSite   = "imobiliaria-demo"   # <- mesmo nome que você deu no Local
$nomeTema   = "imobiliaria-bs"

$localSites = "$env:USERPROFILE\Local Sites"
$temaOrigin = "$PSScriptRoot\template-wordpress"
$temaDestino = "$localSites\$nomeSite\app\public\wp-content\themes\$nomeTema"

if (-not (Test-Path $localSites)) {
    Write-Host "ERRO: Pasta 'Local Sites' nao encontrada em: $localSites" -ForegroundColor Red
    Write-Host "Verifique se o Local by WP Engine foi instalado e se o site '$nomeSite' foi criado." -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "$localSites\$nomeSite")) {
    Write-Host "ERRO: Site '$nomeSite' nao encontrado em Local Sites." -ForegroundColor Red
    Write-Host "Crie o site no Local primeiro com o nome '$nomeSite'." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Instalando tema '$nomeTema'..." -ForegroundColor Cyan

# Remove versao antiga se existir
if (Test-Path $temaDestino) {
    Remove-Item $temaDestino -Recurse -Force
    Write-Host "  Versao anterior removida." -ForegroundColor Gray
}

# Copia o tema
Copy-Item -Path $temaOrigin -Destination $temaDestino -Recurse -Force
Write-Host "  Tema copiado para: $temaDestino" -ForegroundColor Green

# Cria pasta de imagens se nao existir
$imgDir = "$temaDestino\assets\images"
if (-not (Test-Path $imgDir)) { New-Item -ItemType Directory -Path $imgDir | Out-Null }

# Cria imagem placeholder simples (SVG renomeado para .jpg — WordPress aceita)
$placeholder = @"
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#e2e8f0"/>
  <text x="400" y="280" font-family="sans-serif" font-size="28" fill="#94a3b8" text-anchor="middle">Foto do Imóvel</text>
  <text x="400" y="320" font-family="sans-serif" font-size="18" fill="#cbd5e1" text-anchor="middle">Adicione fotos no painel WordPress</text>
</svg>
"@
$placeholder | Out-File "$imgDir\placeholder.jpg" -Encoding utf8

Write-Host ""
Write-Host "SUCESSO! Proximo passo:" -ForegroundColor Green
Write-Host "  1. No Local, clique em 'WP Admin' para abrir o painel" -ForegroundColor White
Write-Host "  2. Va em Aparencia > Temas" -ForegroundColor White
Write-Host "  3. Ative o tema 'Imobiliaria BS'" -ForegroundColor White
Write-Host "  4. Va em Aparencia > Configuracoes da Imobiliaria e preencha os dados" -ForegroundColor White
Write-Host "  5. Crie uma pagina 'Home' e defina o template 'Home'" -ForegroundColor White
Write-Host "  6. Va em Configuracoes > Leitura e defina a pagina inicial como 'Home'" -ForegroundColor White
Write-Host ""
