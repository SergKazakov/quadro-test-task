exports.up = knex =>
  knex.raw(
    `
      call seed_books(100000);

      drop procedure seed_books;
    `,
  )

exports.down = async () => {}
