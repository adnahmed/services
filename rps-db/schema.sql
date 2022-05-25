create schema rps;

comment on schema rps is
	'Schema that contains the state and business logic of our application.';

create table rps.administrators
	( administrator_id 	bigserial primary key
	, username	citext not null
	, name		text not null
	, password	text not null

	, unique (username)
	);

comment on table rps.administrators is
	'Administrators in our Application';

create table rps.examinees
	( examinee_id	bigserial primary key
	, administor_id	bigint references rps.administrators -- Examinee is owned by administrator
	, username	citext not null
	, name		text not null
	, password	text not null

	, unique (username)
	);

comment on table rps.examinees is
	'Examinees in our Application';

create table rps.proctors
	( proctor_id 	bigserial primary key
	, administor_id	bigint references rps.administrators -- Proctor is owned by administrator
	, username	citext not null
	, name		text not null
	, password	text not null

	, unique (username)
	);

comment on table rps.proctors is
	'Proctors in our Application';

create table rps.subjects(
	subject_id 	bigserial primary key
	, administrator_id bigint references rps.administrators -- Subject is owned by administrators
	, name		text not null
	, description	text
	, unique(name)
	)

comment on table rps.subjects is
	'All Subjects in our Application'

create table rps.exams
	( exam_id 	bigserial primary key
	, administrator_id bigint references rps.administrators -- Exam is owned by administrator
	, subject_id	text references	rps.subjects -- Exam belongs to a subject
	, title		text not null
	
	, unique (exam_id)
	);

comment on table rps.exams is
	'All Exams in our Application'

