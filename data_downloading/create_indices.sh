#!/usr/bin/env bash
rm oplog.timestamp
curl -XDELETE "http://localhost:9200/fashion_goy,food_ewg,cosm_ewg,electronics_gp,household_nlm,mongodb_meta"
python create_indices.py
mongo-connector -m localhost:27017 -t localhost:9200 -d elastic2_doc_manager -c config.json --verbose --stdout
