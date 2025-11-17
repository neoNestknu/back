""""add user user_data tables and trigger"

Revision ID: 847037f27aee
Revises: 
Create Date: 2025-10-11 21:40:04.500976

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql as pg



# revision identifiers, used by Alembic.
revision: str = '847037f27aee'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade() -> None:
    # 1) ensure extension (uuid-ossp)
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    # 2) create users table
    op.create_table(
        'users',
        sa.Column(
            'id',
            pg.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text('uuid_generate_v4()'),
            nullable=False,
        ),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True),
        sa.Column('password', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    )

    # 3) create user_data table
    op.create_table(
        'user_data',
        sa.Column(
            'id',
            pg.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text('uuid_generate_v4()'),
            nullable=False,
        ),
        sa.Column(
            'user_id',
            pg.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('user_id', name='uq_user_data_user_id')
    )

    # 4) create trigger function
    op.execute(
        """
        CREATE OR REPLACE FUNCTION create_user_data_automatically()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO user_data (user_id) VALUES (NEW.id);
            RAISE NOTICE 'Automatically created user_data for user_id: %', NEW.id;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        """
    )

    # 5) create trigger
    op.execute(
        """
        CREATE TRIGGER trg_create_user_data
        AFTER INSERT ON users
        FOR EACH ROW
        EXECUTE FUNCTION create_user_data_automatically();
        """
    )


def downgrade() -> None:
    # 1) remove trigger if exists
    op.execute("DROP TRIGGER IF EXISTS trg_create_user_data ON users;")

    # 2) drop function if exists
    op.execute("DROP FUNCTION IF EXISTS create_user_data_automatically();")

    # 3) drop tables (drop child first)
    op.drop_table('user_data')
    op.drop_table('users')

    # 4) optionally drop extension (if you want to remove it)
    # Note: dropping the extension will fail if other objects depend on it.
    op.execute('DROP EXTENSION IF EXISTS "uuid-ossp";')

