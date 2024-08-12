#!/bin/bash
sudo su - ec2-user
cd /home/ec2-user/onef_back
npm install
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 restart NEST_APP --update-env