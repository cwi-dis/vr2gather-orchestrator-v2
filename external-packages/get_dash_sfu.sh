#!/bin/bash
case x$1 in
x)
	echo Usage: $0 release
	echo Will download binaries from https://github.com/MotionSpell/lldash/releases/download/
	echo and install them in the correct place here
    echo For now specify release without the leading v, e.g. 0.1.0
	exit 1
	;;
xv*)
    echo "Specify the version with the v (sorry...)"
    exit 1
    ;;
x*)
	release=$1
	;;
esac
set -e
set -x
external_package_dir=$(realpath $(dirname $0))
cd $external_package_dir
distr=lldash-linux-x86_64-${release}
rm -rf tmp
mkdir -p tmp
curl --location --output tmp/$distr.tar.gz https://github.com/MotionSpell/lldash/releases/download/v${release}/${distr}.tar.gz
rm -rf tmp/$distr
(cd tmp && tar xfv $distr.tar.gz)
rm -rf ../packages/lldash
mkdir -p ../packages
mv tmp/$distr ../packages/lldash
rm -rf tmp
