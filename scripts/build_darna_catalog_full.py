# -*- coding: utf-8 -*-
"""
Full Darna Catalog Builder - 203 richly detailed items across all 14 categories.
"""
import json

OUTPUT_TS_PATH = r"e:\My Projects\Darna Project\src\app\data\catalog.data.ts"

with open(r"e:\My Projects\Darna Project\scripts\append_all_categories.py", "r", encoding="utf-8") as f:
    cat_code = f.read()

# Execute to get CATEGORIES
local_scope = {}
exec(cat_code, {}, local_scope)
CATEGORIES = local_scope["CATEGORIES"]

print("CATEGORIES count:", len(CATEGORIES))
