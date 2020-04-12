#!/bin/bash

# Thanks to https://dev.to/bayardlouis470/create-chrome-extension-in-react-3pna
# this guy is a lifesaver

build() {
    echo 'building react'

    rm -rf dist/*

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false

    yarn build

    mkdir -p dist
    cp -r build/* dist

    mv dist/index.html dist/popup.html
}

build
