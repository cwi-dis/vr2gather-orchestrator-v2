#!/bin/bash

set -x
mkdir -p tmp

# curl --location --output tmp/webrtcsfu-linux.tgz https://github.com/jvdrhoof/WebRTCSFU/releases/download/${release}/webrtcsfu-x86_64-unknown-linux.tgz

rm -rf tmp/evanescent
(cd tmp ; tar xfv ../evanescent.tgz)
rm -rf ../config/packages/evanescent
mv tmp/evanescent ../config/packages/evanescent
rm -rf tmp
