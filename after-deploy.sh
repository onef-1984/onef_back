#!/bin/bash
sudo su -
cd /home/ec2-user/onef_back
npm install
npm run build
npx pm2 restart my-app