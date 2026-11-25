# 本地发布脚本：构建 → 上传国内服务器 + GitHub（API）
# 用法: .\deploy\publish.ps1 -Server root@YOUR_SERVER_IP
param(
    [Parameter(Mandatory = $true)]
    [string]$Server
)

Write-Host "1/3 构建..." -ForegroundColor Cyan
npm run build

Write-Host "2/3 上传到 $Server`:/var/www/aizak ..." -ForegroundColor Cyan
# dist 内容上传（排除旧文件，原子替换）
ssh $Server "mkdir -p /var/www/aizak"
scp -r dist/* "${Server}:/var/www/aizak/"

Write-Host "3/3 完成。访问 https://aizak.cn 验证" -ForegroundColor Green
