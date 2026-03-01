class User {
  static #connection;

  static setConnection(connection) {
    if (connection) this.#connection = connection;
    else throw new Error('❌ connection is not provided!');
  }

  static async initTable() {
    const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(15) NOT NULL UNIQUE,
                password VARCHAR(100) NOT NULL,
                name VARCHAR(20) NOT NULL,
                registered DATETIME DEFAULT CURRENT_TIMESTAMP,
                isAdult BOOLEAN NOT NULL,
                phone VARCHAR(20) NOT NULL
            );
        `;

    await this.#connection.execute(query);
  }

  static async create(user) {
    const { username, password, name, isAdult, phone } = user;

    if (!username || typeof username !== 'string') throw new Error('Username must be a non-empty string');
    if (!password || typeof password !== 'string') throw new Error('Password must be a non-empty string');
    if (!name || typeof name !== 'string') throw new Error('Name must be a non-empty string');
    if (typeof isAdult !== 'boolean') throw new Error('isAdult must be a boolean value');
    if (!phone || typeof phone !== 'string') throw new Error('Phone must be a non-empty string');

    const query = `
        INSERT INTO users (username, password, name, isAdult, phone)
        VALUES (?, ?, ?, ?, ?)
      `;

    const [result] = await this.#connection.execute(query, [username, password, name, isAdult, phone]);

    return { id: result.insertId };
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await this.#connection.execute(query, [username]);

    return rows.length ? rows[0] : null;
  }

  static async findById(id) {
    const query = 'SELECT username, name, registered, isAdult, phone FROM users WHERE id = ?';
    const [rows] = await this.#connection.execute(query, [id]);

    return rows.length ? rows[0] : null;
  }

  static async updateById(id, updatedFields) {
    const { username, password, name, isAdult, phone } = updatedFields;

    if (username !== undefined && typeof username !== 'string') throw new Error('Username must be a non-empty string');
    if (password !== undefined && typeof password !== 'string') throw new Error('Password must be a non-empty string');
    if (name !== undefined && typeof name !== 'string') throw new Error('Name must be a non-empty string');
    if (isAdult !== undefined && typeof isAdult !== 'boolean') throw new Error('isAdult must be a boolean value');
    if (phone !== undefined && typeof phone !== 'string') throw new Error('Phone must be a non-empty string');

    const fields = [];
    const values = [];

    for (const [key, val] of Object.entries({ username, password, name, isAdult, phone })) {
      if (val !== undefined) {
        fields.push(`${key} = ?`);
        values.push(val);
      }
    }

    values.push(id);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

    const [result] = await this.#connection.execute(query, values);

    return Boolean(result.affectedRows);
  }

  static async deleteById(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await this.#connection.execute(query, [id]);

    return Boolean(result.affectedRows);
  }
}

export default User;
