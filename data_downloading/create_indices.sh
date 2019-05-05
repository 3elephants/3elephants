#!/usr/bin/env bash
rm oplog.timestamp
curl -XDELETE "https://search-elephants-three-cjfiindqrlstztq54fmklpvuum.us-east-1.es.amazonaws.com/fashion_goy,food_ewg,cosm_ewg,electronics_gp,household_nlm,mongodb_meta"
python create_indices.py
mongo-connector -m localhost:27017 -t https://search-elephants-three-cjfiindqrlstztq54fmklpvuum.us-east-1.es.amazonaws.com -d elastic2_doc_manager -c config.json --verbose --stdout
