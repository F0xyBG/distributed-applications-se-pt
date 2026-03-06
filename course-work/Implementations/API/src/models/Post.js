class Post {
  static #connection;

  static setConnection(connection) {
    if (connection) this.#connection = connection;
    else throw new Error('❌ connection is not provided!');
  }

  static async initTable() {
    const query = `
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                author_id INT NOT NULL,
                title VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                image VARCHAR(200) NOT NULL,
                category ENUM('dog', 'cat', 'parrot', 'snake') NOT NULL,
                isFound BOOLEAN NOT NULL DEFAULT FALSE,
                lostAt VARCHAR(50) NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT fk_posts_author
                    FOREIGN KEY (author_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            );
        `;

    await this.#connection.execute(query);
  }

  static async getAllPosts() {
    const query = `
            SELECT 
                p.*,
                u.name AS author_name,
                u.phone AS author_phone
            FROM posts p
            JOIN users u ON p.author_id = u.id
            WHERE p.isFound = FALSE
            ORDER BY p.date DESC;
        `;

    const [rows] = await this.#connection.execute(query);

    return rows.length ? rows : [];
  }

  static async getPostsByAuthorId(authorId) {
    const query = 'SELECT * FROM posts WHERE author_id = ?';

    const [rows] = await this.#connection.execute(query, [authorId]);

    return rows.length ? rows : [];
  }

  static async create(post) {
    const { author_id, title, description, image, category, lostAt } = post;

    if (!title || typeof title !== 'string') throw new Error('Title must be a non-empty string');
    if (!description || typeof description !== 'string') throw new Error('Description must be a non-empty string');
    if (!image || typeof image !== 'string') throw new Error('Image must be a non-empty string');
    if (!category || !['dog', 'cat', 'parrot', 'snake'].includes(category))
      throw new Error('Category must be one of: dog, cat, parrot, snake');
    if (!lostAt || typeof lostAt !== 'string') throw new Error('LostAt must be a non-empty string');
    if (!author_id || typeof author_id !== 'number') throw new Error('Author ID must be a valid number');

    const query = `
        INSERT INTO posts (author_id, title, description, image, category, lostAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

    const [result] = await this.#connection.execute(query, [author_id, title, description, image, category, lostAt]);

    return { id: result.insertId };
  }

  static async updateById(id, updatedFields) {
    const { title, description, image, isFound, lostAt } = updatedFields;

    if (title !== undefined && typeof title !== 'string') throw new Error('Title must be a non-empty string');
    if (description !== undefined && typeof description !== 'string') throw new Error('Description must be a non-empty string');
    if (image !== undefined && typeof image !== 'string') throw new Error('Image must be a non-empty string');
    if (isFound !== undefined && typeof isFound !== 'boolean') throw new Error('isFound must be a boolean value');
    if (lostAt !== undefined && typeof lostAt !== 'string') throw new Error('LostAt must be a non-empty string');

    const fields = [];
    const values = [];

    for (const [key, val] of Object.entries({ title, description, image, isFound, lostAt })) {
      if (val !== undefined) {
        fields.push(`${key} = ?`);
        values.push(val);
      }
    }

    values.push(id);

    const query = `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`;

    const [result] = await this.#connection.execute(query, values);

    return Boolean(result.affectedRows);
  }

  static async findById(id) {
    const query = `
            SELECT 
                p.*,
                u.name AS author_name,
                u.phone AS author_phone
            FROM posts p
            JOIN users u ON p.author_id = u.id
            WHERE p.id = ?
            ORDER BY p.date DESC;
        `;
    const [rows] = await this.#connection.execute(query, [id]);

    return rows.length ? rows[0] : null;
  }

  static async deleteById(id) {
    const query = 'DELETE FROM posts WHERE id = ?';
    const [result] = await this.#connection.execute(query, [id]);

    return Boolean(result.affectedRows);
  }
}

export default Post;
