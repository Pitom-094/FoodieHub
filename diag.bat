@echo off
whoami > e:\foodie-hub\user.txt
echo %PATH% > e:\foodie-hub\path.txt
node -v > e:\foodie-hub\node_ver.txt 2>&1
npm -v > e:\foodie-hub\npm_ver.txt 2>&1
ver > e:\foodie-hub\os_ver.txt
