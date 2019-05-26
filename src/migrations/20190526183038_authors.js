exports.up = knex =>
  knex.raw(
    `
      create table authors(
        id binary(16) not null default (uuid_to_bin(uuid(), 1)) primary key,
        first_name text,
        last_name text,
        created_at timestamp not null default now(),
        updated_at timestamp not null default now() on update now()
      );
    `,
  )

exports.down = knex => knex.raw(`drop table authors;`)
