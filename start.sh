#!/bin/sh

# This file is how Fly starts the server (configured in fly.toml). Before starting
# the server though, we need to run any prisma migrations that haven't yet been
# run, which is why this file exists in the first place.
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

set -ex

# Enable swap so that prisma migrate runs without running out of memory on hobby plan with 256MB RAM
# Common problem: https://community.fly.io/t/prisma-sqlite-causes-an-out-of-memory-error-on-deploy/11039
# Code is from Fly docs: https://fly.io/docs/rails/cookbooks/deploy/#enabling-swap
fallocate -l 512M /swapfile
chmod 0600 /swapfile
mkswap /swapfile
echo 10 > /proc/sys/vm/swappiness
swapon /swapfile
echo 1 > /proc/sys/vm/overcommit_memory

npx prisma migrate deploy
npx remix-serve build
