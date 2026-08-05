import os
import re

src_dir = "src"

replacements = [
    (r'\bDealers\b', 'Customers'),
    (r'\bDealer\b', 'Customer'),
    (r'\bdealers\b', 'customers'),
    (r'\bdealer\b', 'customer'),
    (r'\bDEALERS\b', 'CUSTOMERS'),
    (r'\bDEALER\b', 'CUSTOMER'),
    # Specific fields
    (r'\bdealerId\b', 'customerId'),
    (r'\bdealerName\b', 'customerName'),
    (r'\btotalDealers\b', 'totalCustomers')
]

# Rename file first
old_file = os.path.join(src_dir, "pages", "Dealers.tsx")
new_file = os.path.join(src_dir, "pages", "Customers.tsx")
if os.path.exists(old_file):
    os.rename(old_file, new_file)

# Process all files
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".ts", ".tsx", ".css")):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements:
                new_content = re.sub(old, new, new_content)
                
            if new_content != content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated {filepath}")

print("Replacement complete.")
