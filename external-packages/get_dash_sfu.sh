#!/bin/bash
case x$1 in
x)
	echo Usage: $0 release
	echo Will download binaries from https://github.com/MotionSpell/lldash/releases/download/release
	echo and install them in the correct place here
	exit 1
	;;
x*)
	release=$1
	;;
esac
set -x
mkdir -p tmp

distr=lldash-linux-x86_64-${release}

curl --location --output tmp/$distr.tar.gz https://github.com/MotionSpell/lldash/releases/download/${release}/${distr}.tar.gz
rm -rf tmp/$distr
(cd tmp && tar xfv $distr.tar.gz)
rm -rf ../packages/lldash
mkdir -p ../packages/lldash
mv tmp/$distr ../packages/lldash
rm -rf tmp
