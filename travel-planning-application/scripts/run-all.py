import subprocess
import os

print("[v0] GlobalTrotters Database Setup")
print("[v0] ================================")
print()

# Check if SQL scripts exist
schema_file = "scripts/001-initial-schema.sql"
seed_file = "scripts/002-seed-data.sql"

if os.path.exists(schema_file):
    print(f"[v0] ✓ Found {schema_file}")
else:
    print(f"[v0] ✗ Missing {schema_file}")

if os.path.exists(seed_file):
    print(f"[v0] ✓ Found {seed_file}")
else:
    print(f"[v0] ✗ Missing {seed_file}")

print()
print("[v0] Database will be automatically created when you first use the app")
print("[v0] The SQL scripts will be executed client-side using sql.js")
print()
print("[v0] To use the app:")
print("[v0] 1. Sign up for a new account")
print("[v0] 2. The database will be initialized in your browser's localStorage")
print("[v0] 3. Start creating trips!")
