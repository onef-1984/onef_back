#!/bin/bash
sudo su -
cd /home/ec2-user/onef_back
npm install
npx prisma migrate deploy
npx prisma generate
npm run build
npx pm2 restart my-app