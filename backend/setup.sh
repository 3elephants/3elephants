#!/usr/bin/env bash
source $DIR/.env
pip install -r requirements.txt
pip install -U pytest
python setup.py