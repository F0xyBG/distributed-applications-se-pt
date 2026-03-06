class Comment {
  static #connection;

  static setConnection(connection) {
    if (connection) this.#connection = connection;
    else throw new Error('❌ connection is not provided!');
  }

  static async initTable() {
    const query = `
            CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                post_id INT NOT NULL,
                author_id INT NOT NULL,
                comment TEXT NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT fk_comments_post
                    FOREIGN KEY (post_id)
                    REFERENCES posts(id)
                    ON DELETE CASCADE,

                CONSTRAINT fk_comments_author
                    FOREIGN KEY (author_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            );
        `;

    await this.#connection.execute(query);
  }

  static async create(comment) {
    const { post_id, author_id, comment: commentText } = comment;

    if (!commentText || typeof commentText !== 'string') throw new Error('Comment text must be a non-empty string');
    if (!post_id || typeof post_id !== 'number') throw new Error('post_id must be a valid number');
    if (!author_id || typeof author_id !== 'number') throw new Error('author_id must be a valid number');

    const query = `
            INSERT INTO comments (post_id, author_id, comment)
            VALUES (?, ?, ?)
        `;

    const [result] = await this.#connection.execute(query, [post_id, author_id, commentText]);

    return { id: result.insertId };
  }

  static async getByPostId(postId) {
    const query = `
        SELECT c.id, c.comment, c.date, u.name as author_name, u.id as author_id
        FROM comments c
        JOIN users u ON c.author_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.date DESC
    `;

    const [rows] = await this.#connection.execute(query, [postId]);
    return rows;
  }

  static async updateById(id, comment) {
    const { comment: commentText } = comment;

    if (!commentText || typeof commentText !== 'string') throw new Error('Comment text must be a non-empty string');

    const query = `
            UPDATE comments
            SET comment = ?
            WHERE id = ?
    `;

    const [result] = await this.#connection.execute(query, [commentText, id]);

    return Boolean(result.affectedRows);
  }

  static async deleteById(id) {
    const query = 'DELETE FROM comments WHERE id = ?';
    const [result] = await this.#connection.execute(query, [id]);

    return Boolean(result.affectedRows);
  }

  static async findById(id) {
    const query = 'SELECT author_id FROM comments WHERE id = ?';
    const [rows] = await this.#connection.execute(query, [id]);

    return rows.length ? rows[0] : null;
  }
}

export default Comment;
