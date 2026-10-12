@echo off
title Misi Nombor Arab - Kelas 1 Gamma
cd /d "%~dp0"

echo ===================================================
echo     MISI NOMBOR ARAB : KELAS 1 GAMMA
echo     Pelayan Tempatan Sedang Dimulakan...
echo ===================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"

if %errorlevel% neq 0 (
    echo.
    echo Ralat berlaku semasa menjalankan pelayan.
    pause
)
