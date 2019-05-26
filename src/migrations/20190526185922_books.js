exports.up = knex =>
  knex.raw(
    `
      create table books(
        id binary(16) not null default (uuid_to_bin(uuid())) primary key,
        title text not null,
        description text not null,
        image text,
        author binary(16) not null,
        created_at timestamp not null default now(),
        updated_at timestamp not null default now() on update now(),
        constraint books_author_fkey foreign key (author) references authors (id) on delete cascade
      );
    `,
  )

exports.down = knex => knex.raw(`drop table books;`)
