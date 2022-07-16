#!/bin/sh

echo "[recoil-sync-next] copy to current directory..."

CURRENT=`pwd`
cd ../../
yarn clean-build
yarn pack --filename recoil-sync-next-local.tgz

cd $CURRENT/node_modules
rm -Rf recoil-sync-next/
tar zxf ../../../recoil-sync-next-local.tgz
mv package/ recoil-sync-next/

cd ..
rm -Rf .next/

echo "[recoil-sync-next] copy success!"
exit $?
