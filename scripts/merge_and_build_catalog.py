# -*- coding: utf-8 -*-
"""
Merges all category items and outputs src/app/data/catalog.data.ts
"""
import json
import os

from append_all_categories import CATEGORIES
from catalog_data_definitions import ITEMS_PART_1
from catalog_data_definitions_2 import ITEMS_PART_2
from catalog_data_definitions_3 import ITEMS_PART_3
from catalog_data_definitions_4 import ITEMS_PART_4

all_items = []
all_items.extend(ITEMS_PART_1)
all_items.extend(ITEMS_PART_2)
all_items.extend(ITEMS_PART_3)
all_items.extend(ITEMS_PART_4)

print(f"Total Categories: {len(CATEGORIES)}")
print(f"Total Items: {len(all_items)}")

# Count items per category
counts = {}
for item in all_items:
    cat = item["categoryId"]
    counts[cat] = counts.get(cat, 0) + 1

for cat, count in counts.items():
    print(f"  - {cat}: {count} items")

# Generate TypeScript code
ts_lines = [
    "import { CatalogCategory, CatalogItem } from '../models/catalog.model';",
    "",
    "export const CATALOG_CATEGORIES: CatalogCategory[] = " + json.dumps(CATEGORIES, indent=2, ensure_ascii=False) + ";",
    "",
    "export const CATALOG_ITEMS: CatalogItem[] = " + json.dumps(all_items, indent=2, ensure_ascii=False) + ";",
    ""
]

ts_content = "\n".join(ts_lines)

target_file = r"e:\My Projects\Darna Project\src\app\data\catalog.data.ts"
with open(target_file, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully generated {target_file} with {len(all_items)} items!")
