source ~/.bashrc

yarn install --production
pm2 restart clanflare-backend-dev
