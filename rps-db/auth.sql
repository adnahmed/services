\set QUIET on
\set ON_ERROR_STOP on

begin;
	-- `pgcrypto` to salt and hash passwords and generate random session tokens
	-- `citext` case insensitive text type for usernames

\echo 'Creating extensions'

create extension pgcrypto;
create extension citext;




