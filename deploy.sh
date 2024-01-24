source ~/.bashrc

cd cf
yarn install --production
pm2 restart clanflare-backend-dev
