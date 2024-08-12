#!/bin/bash

cd /home/ec2-user/onef_back
pwd
npm install
npx prisma migrate deploy
npx prisma generate
pwd
sudo npm run build
pwd
pm2 restart NEST_APP --update-env