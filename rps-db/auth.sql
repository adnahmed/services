\set QUIET on
\set ON_ERROR_STOP on

begin;
	-- `pgcrypto` to salt and hash passwords and generate random session tokens
	-- `citext` case insensitive text type for usernames
	-- `pgtap` for describing and running tests. *requires installation*

\echo 'Creating extensions'

create extension pgcrypto;
create extension citext;
create extension pgtap;




