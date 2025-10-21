import os
import sys
import psycopg2

"""
Simple database migration manager for PostgreSQL
Usage:
    python migrate.py up    - Run all pending migrations
    python migrate.py down  - Rollback last migration
    python migrate.py reset - Rollback all migrations
    python migrate.py seed  - Run all seeds
"""

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'database'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', '123123')
}

MIGRATIONS_DIR = 'migrations'
SEEDS_DIR = 'migrations/seeds'


def get_connection():
    """Create database connection"""
    return psycopg2.connect(**DB_CONFIG)


def create_migrations_table():
    """Create migrations tracking table if not exists"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
                CREATE TABLE IF NOT EXISTS schema_migrations
                (
                    id
                    SERIAL
                    PRIMARY
                    KEY,
                    version
                    VARCHAR
                (
                    255
                ) UNIQUE NOT NULL,
                    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
    conn.commit()
    cur.close()
    conn.close()


def get_applied_migrations():
    """Get a list of applied migrations"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT version FROM schema_migrations ORDER BY version")
    applied = [row[0] for row in cur.fetchall()]
    cur.close()
    conn.close()
    return applied


def get_migration_files():
    """Get sorted list of migration files"""
    files = [f for f in os.listdir(MIGRATIONS_DIR)
             if f.endswith('.sql') and not f.startswith('seed_')]
    return sorted(files)


def run_migration_up(filename):
    """Run up migration"""
    filepath = os.path.join(MIGRATIONS_DIR, filename)
    with open(filepath, 'r') as f:
        content = f.read()
        # Split by -- DOWN marker
        parts = content.split('-- DOWN')
        up_sql = parts[0].replace('-- UP', '').strip()

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(up_sql)
        cur.execute("INSERT INTO schema_migrations (version) VALUES (%s)", (filename,))
        conn.commit()
        print(f"✓ Applied: {filename}")
    except Exception as e:
        conn.rollback()
        print(f"✗ Error applying {filename}: {e}")
        raise
    finally:
        cur.close()
        conn.close()


def run_migration_down(filename):
    """Run down migration"""
    filepath = os.path.join(MIGRATIONS_DIR, filename)
    with open(filepath, 'r') as f:
        content = f.read()
        # Get DOWN part
        parts = content.split('-- DOWN')
        if len(parts) < 2:
            print(f"✗ No DOWN migration found in {filename}")
            return
        down_sql = parts[1].strip()

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(down_sql)
        cur.execute("DELETE FROM schema_migrations WHERE version = %s", (filename,))
        conn.commit()
        print(f"✓ Rolled back: {filename}")
    except Exception as e:
        conn.rollback()
        print(f"✗ Error rolling back {filename}: {e}")
        raise
    finally:
        cur.close()
        conn.close()


def migrate_up():
    """Run all pending migrations"""
    create_migrations_table()
    applied = get_applied_migrations()
    migrations = get_migration_files()
    pending = [m for m in migrations if m not in applied]

    if not pending:
        print("No pending migrations")
        return

    for migration in pending:
        run_migration_up(migration)


def migrate_down():
    """Rollback last migration"""
    create_migrations_table()
    applied = get_applied_migrations()

    if not applied:
        print("No migrations to rollback")
        return

    last_migration = applied[-1]
    run_migration_down(last_migration)


def migrate_reset():
    """Rollback all migrations"""
    create_migrations_table()
    applied = get_applied_migrations()

    if not applied:
        print("No migrations to rollback")
        return

    for migration in reversed(applied):
        run_migration_down(migration)


def run_seeds():
    """Run all seed files"""
    if not os.path.exists(SEEDS_DIR):
        print(f"Seeds directory not found: {SEEDS_DIR}")
        return

    seed_files = sorted([f for f in os.listdir(SEEDS_DIR) if f.endswith('.sql')])

    if not seed_files:
        print("No seed files found")
        return

    conn = get_connection()
    cur = conn.cursor()

    for seed_file in seed_files:
        filepath = os.path.join(SEEDS_DIR, seed_file)
        with open(filepath, 'r') as f:
            seed_sql = f.read()
        try:
            cur.execute(seed_sql)
            conn.commit()
            print(f"✓ Seeded: {seed_file}")
        except Exception as e:
            conn.rollback()
            print(f"✗ Error seeding {seed_file}: {e}")

    cur.close()
    conn.close()


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    command = sys.argv[1]

    try:
        if command == 'up':
            migrate_up()
        elif command == 'down':
            migrate_down()
        elif command == 'reset':
            migrate_reset()
        elif command == 'seed':
            run_seeds()
        else:
            print(f"Unknown command: {command}")
            print(__doc__)
            sys.exit(1)
    except Exception as e:
        print(f"Migration failed: {e}")
        sys.exit(1)