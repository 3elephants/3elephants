#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
#testing
source $DIR/.env
py.test $DIR/src/tests.py
#run dev server
python $DIR/src/flask_server.py
