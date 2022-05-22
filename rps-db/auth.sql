\set QUIET on
\set ON_ERROR_STOP on

begin;
	-- `pgcrypto` to salt and hash passwords and generate random session tokens
	-- `citext` case insensitive text type for usernames

\echo 'Creating extensions'

create extension pgcrypto;
create extension citext;


\echo 'Setting up roles...'

create role authenticator noinherit login;

comment on role authenticator is
	'Role that serves as an entry-point for API servers such as PostgREST.';

create role anonymous nologin noinherit;

comment on role anonymous is 
	'The role that PostgREST will switch to when a user is not authenticated.';

create role examinee nologin noinherit;

comment on role examinee is
	'Role that PostgREST will switch to for authenticated examinees.';

create role proctor nologin noinherit;

comment on role proctor is
	'Role that PostgREST will switch to for authenticated proctors';

create role admin nologin noinherit;

comment on role admin is
	'Role that PostgREST will switch to for authenticated administrators';

-- Allow autenticator role to switch to other roles
grant anonymous, examinee, proctor, admin to authenticator;

alter role authenticator set password to pgrestPassword


