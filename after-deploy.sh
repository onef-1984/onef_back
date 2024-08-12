#!/bin/bash

cd /home/ec2-user/onef_back
npm install
npx prisma migrate deploy
npx prisma generate
sudo npm run build
pm2 restart NEST_APP --update-env