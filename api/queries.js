const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "membership-app",
  password: "password",
  port: 5432,
});

const getMembers = (request, response) => {
  pool.query(
    "SELECT id, first_name, last_name, sex, relationship_status, TO_CHAR(birth_date :: DATE, 'dd/mm/yyyy') birth_date, TO_CHAR(expiry_date :: DATE, 'dd/mm/yyyy') expiry_date FROM members ORDER BY id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getMemberById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM members WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createMember = (request, response) => {
  const {
    first_name,
    last_name,
    birth_date,
    expiry_date,
    sex,
    relationship_status,
    photo,
  } = request.body;

  pool.query(
    "INSERT INTO members (first_name, last_name, birth_date, expiry_date, sex, relationship_status, photo) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [
      first_name,
      last_name,
      birth_date,
      expiry_date,
      sex,
      relationship_status,
      photo,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.insertId}`);
    }
  );
};

const updateMember = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE members SET first_name = $1, last_name = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteMember = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM members WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

const getDates = (request, response) => {
  pool.query(
    "SELECT first_name, last_name, TO_CHAR(entry_date :: DATE, 'dd/mm/yyyy') entry_date FROM dates AS t INNER JOIN members AS m ON t.member_id = m.id ORDER BY entry_date DESC",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getDate = (request, response) => {
  const date = request.params.date;

  pool.query(
    "SELECT first_name, last_name, TO_CHAR(entry_date :: DATE, 'dd/mm/yyyy')  entry_date FROM dates AS t INNER JOIN members AS m ON t.member_id = m.id WHERE entry_date = $1 ORDER BY entry_date DESC",
    [date],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getDates,
  getDate,
};
