#!/usr/bin/env bash
pip3 install --upgrade pip
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
source $DIR/.env
pip install -r $DIR/requirements.txt
pip install -U pytest
