create table authors (
  id uuid default uuidv7() primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  first_name text,
  last_name text
);

create table books (
  id uuid default uuidv7() primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_id uuid not null references authors,
  title text not null,
  description text not null,
  image text
);
