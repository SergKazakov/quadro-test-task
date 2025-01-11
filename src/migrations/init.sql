create table authors (
  id int generated always as identity (minvalue -2147483648) primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  first_name text,
  last_name text
);

create table books (
  id int generated always as identity (minvalue -2147483648) primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_id int not null references authors,
  title text not null,
  description text not null,
  image text
);
