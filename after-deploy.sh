#!/bin/bash
sudo su -
cd /home/ec2-user/onef_back
npm install
dotenv -e .env.production -- npx prisma migrate deploy
dotenv -e .env.production -- npx prisma generate
npm run build
pm2 restart NEST_APP --update-env