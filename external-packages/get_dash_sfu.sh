#!/bin/bash

set -x
mkdir -p tmp

curl --location --output tmp/evanescent.tar.bz2 https://github.com/cwi-dis/VR2G-Evanescent/releases/download/v7.1.1_stable/evanescent.tar.bz2
# https://github.com/cwi-dis/VR2G-Evanescent/releases/download/v7.1.1_stable/evanescent.tar.bz2
rm -rf tmp/evanescent
(cd tmp ; tar xfv evanescent.tar.bz2)
rm -rf ../config/packages/evanescent
mv tmp/evanescent/7/gnu ../config/packages/evanescent
rm -rf tmp
