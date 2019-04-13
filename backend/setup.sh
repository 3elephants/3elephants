#!/usr/bin/env bash
pip3 install --upgrade pip
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
source $DIR/.env
pip3 install -r $DIR/requirements.txt
pip3 install -U pytest
