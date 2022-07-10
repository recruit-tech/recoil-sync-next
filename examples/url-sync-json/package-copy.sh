#!/bin/sh

echo "[recoil-sync-next] copy to current directory..."

CURRENT=`pwd`
cd ../../
yarn pack --filename recoil-sync-next-local.tgz

cd $CURRENT/node_modules
mkdir recoil-sync-next
tar zxf ../../../recoil-sync-next-local.tgz
mv package recoil-sync-next

echo "[recoil-sync-next] copy success!"
exit $?
