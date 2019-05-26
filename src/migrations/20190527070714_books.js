exports.up = knex =>
  knex.raw(
    `
      create procedure seed_books(total int)
      begin
        declare author_id binary(16);

        declare i int default 0;

        set author_id = uuid_to_bin(uuid());

        insert into authors (id) values (author_id);

        while i < total do
          insert into books (
            author,
            title,
            description,
            image
          ) values (
            author_id,
            substring(md5(rand()) from 1 for 10),
            substring(md5(rand()) from 1 for 20),
            concat(substring(md5(rand()) from 1 for 10), '.png')
          );

          set i = i + 1;
        end while;
      end;
    `,
  )

exports.down = async () => {}
