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

-- `auth` and `api` roles will own their respective schemas with tables, views and functions defined in them

create role auth nologin;

comment on role auth is
	'Role that owns the auth schema and its objects'

create role api nologin;

comment on role api is
	'Role that owns the api schema and its objects'

-- BY default all database users with `PUBLIC` role have privilages to execute any function that is defined.

alter default privileges revoke execute on functions from public;

-- Also remove default execute privilages from auth and api roles as defaults apply per user

alter default privileges for role auth, api revoke execute on functions from public;

--- #### Hashing Password
--- Salt and Hash all passwords with a trigger.
--- ```sql

create function rps.cryptpassword()
	returns trigger
	language plpgsql
	as $$
	   begin
		if tg_op = 'INSERT' or new.password<> old.password then
			new.password = crypt(new.password, gen_salt('bf'));
		end if;
		return new;
	end
	$$;

create trigger cryptpassword
	before insert or update 
	on rps.examinees
	for each row
	execute procedure rps.cryptpassword();

create trigger cryptpassword
	before insert or update
 	on rps.proctors
	for each row
	execute procedure rps.cryptpassword();
create trigger cryptpassword
 	before insert or update
	on rps.administrators
 	for each row
 	execute procedure rps.cryptpassword();
--- #### Permissions on the `examinees` table
grant references, select(examinee_id, username, password) on table rps.examinees to auth;

---  #### Permissions on the `proctors` table
grant references, select(proctor_id, username, password) on table rps.proctors to auth;

--- #### Permissions on the `administrators` table
grant references, select(administrator_id, username, password) on table rps.administrators to auth;


