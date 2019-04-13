#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
rm -rf $DIR/src/__pycache__
mv $DIR/src/tests.py $DIR
rm $DIR/../deployments/backend.zip
pip install -r $DIR/requirements.txt --target $DIR/src/packages
cd currentPath="$PWD"
cd $DIR/src
zip -r   -X $DIR/../deployments/backend.zip . -x "__pycache__/*" *.DStore* *.idea*
mkdir $DIR/src/packages
cd packages
zip -ur $DIR/../deployments/backend.zip .
cd currentPath
rm -rf $DIR/src/packages
mv $DIR/tests.py $DIR/src
