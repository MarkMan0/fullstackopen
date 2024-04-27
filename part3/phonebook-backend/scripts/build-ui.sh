#!/bin/bash

function die() {
    echo "$@"
    exit 1
}

rm -rf dist/
cd ../../part2/phonebook/ || die "cd failed"
npm install || die "npm install failed"
npm run build || die "npm build failed"
cp -ar dist/ ../../part3/phonebook-backend || die "couldnt copy dist"
