const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "membership-app",
  password: "password",
  port: 5432,
});

const getMembers = async (request, response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, first_name, last_name, sex, relationship_status, TO_CHAR(birth_date :: DATE, 'dd/mm/yyyy') birth_date, TO_CHAR(expiry_date :: DATE, 'dd/mm/yyyy') expiry_date FROM members ORDER BY id ASC"
    );
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const getMemberById = async (request, response) => {
  try {
    const id = parseInt(request.params.id);

    const { rows } = await pool.query("SELECT * FROM members WHERE id = $1", [
      id,
    ]);
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const createMember = async (request, response) => {
  try {
    const {
      first_name,
      last_name,
      birth_date,
      expiry_date,
      sex,
      relationship_status,
      photo,
      notes,
    } = request.body;

    const { rows } = await pool.query(
      "INSERT INTO members (first_name, last_name, birth_date, expiry_date, sex, relationship_status, photo, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        first_name,
        last_name,
        birth_date,
        expiry_date,
        sex,
        relationship_status,
        photo,
        notes,
      ]
    );
    response.status(201).send(`User added with ID: ${rows.insertId}`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const updateMember = async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const {
      first_name,
      last_name,
      birth_date,
      expiry_date,
      sex,
      relationship_status,
      photo,
      notes,
    } = request.body;

    await pool.query(
      "UPDATE members SET first_name = $1, last_name = $2, birth_date = $3, expiry_date = $4, sex = $5, relationship_status = $6, photo = $7, notes = $8 WHERE id = $9",
      [
        first_name,
        last_name,
        birth_date,
        expiry_date,
        sex,
        relationship_status,
        photo,
        notes,
        id,
      ]
    );
    response.status(200).send(`User modified with ID: ${id}`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const deleteMember = async (request, response) => {
  try {
    const id = parseInt(request.params.id);

    // Need to delete all check in dates for the member before deleting the member. Cascade is weird.
    await pool.query("DELETE FROM dates WHERE member_id = $1", [id]);

    await pool.query(
      "DELETE FROM couples WHERE member_id_1 = $1 OR member_id_2 = $1",
      [id]
    );

    const { rows } = await pool.query(
      "SELECT id FROM members WHERE NOT EXISTS (SELECT 1 FROM couples WHERE couples.member_id_1 = members.id OR couples.member_id_2 = members.id)"
    );

    let singles = [];

    rows.map((single) => {
      singles.push(single.id);
    });

    let query = `UPDATE members SET relationship_status = $1 WHERE id IN (${singles.join(
      ","
    )})`;

    await pool.query(query, ["Single"]);

    await pool.query("DELETE FROM members WHERE id = $1", [id]);
    response.status(200).send(`User deleted with ID: ${id}`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const getDates = async (request, response) => {
  try {
    const { rows } = await pool.query(
      "SELECT first_name, last_name, TO_CHAR(entry_date :: DATE, 'dd/mm/yyyy') entry_date FROM dates AS t INNER JOIN members AS m ON t.member_id = m.id ORDER BY entry_date DESC"
    );
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const getDate = async (request, response) => {
  try {
    const date = request.params.date;

    const { rows } = await pool.query(
      "SELECT first_name, last_name, TO_CHAR(entry_date :: DATE, 'dd/mm/yyyy')  entry_date FROM dates AS t INNER JOIN members AS m ON t.member_id = m.id WHERE entry_date = $1 ORDER BY entry_date DESC",
      [date]
    );
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const checkinMember = async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    await pool.query(`INSERT INTO dates (member_id) VALUES ($1)`, [id]);
    response.status(201).send(`User checked in today with ID: ${id}`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const queryMember = async (request, response) => {
  try {
    let query =
      "SELECT id, first_name, last_name, sex, relationship_status, TO_CHAR(birth_date :: DATE, 'dd/mm/yyyy') birth_date, TO_CHAR(expiry_date :: DATE, 'dd/mm/yyyy') expiry_date FROM members ";

    const params = request.query;

    if (Object.keys(params)) {
      query += "WHERE ";
      let first = true;
      Object.entries(params).map(([key, val]) => {
        query += first ? `${key}='${val}'` : ` AND ${key}='${val}'`;
        first = false;
      });
    }

    const { rows } = await pool.query(query);
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const createCouple = async (request, response) => {
  try {
    let { member_1, member_2 } = request.body;

    await pool.query(
      "UPDATE members SET relationship_status = $1 WHERE id IN ($2, $3)",
      ["Couple", member_1, member_2]
    );

    await pool.query(
      "INSERT into couples (member_id_1, member_id_2) VALUES ($1, $2)",
      [member_1, member_2]
    );

    response
      .status(201)
      .send(`Users ${member_1} and ${member_2} are now coupled.`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const getMemberCouple = async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const { rows } = await pool.query(
      `SELECT * FROM couples WHERE member_id_1 = ${id} OR member_id_2 = ${id}`
    );
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const getCouples = async (request, response) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, member_id_1, member_id_2 FROM couples`
    );
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const deleteCouple = async (request, response) => {
  try {
    const { member_1, member_2 } = request.body;

    await pool.query(
      "DELETE FROM couples WHERE (member_id_1 = $1 AND member_id_2 = $2) OR (member_id_1 = $2 AND member_id_2 = $1)",
      [member_1, member_2]
    );

    const { rows } = await pool.query(
      "SELECT id FROM members WHERE NOT EXISTS (SELECT 1 FROM couples WHERE couples.member_id_1 = members.id OR couples.member_id_2 = members.id)"
    );

    let singles = [];

    rows.map((single) => {
      singles.push(single.id);
    });

    let query = `UPDATE members SET relationship_status = $1 WHERE id IN (${singles.join(
      ","
    )})`;

    await pool.query(query, ["Single"]);

    response.status(200).send(`Couple deleted.`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getDates,
  getDate,
  queryMember,
  checkinMember,
  getCouples,
  getMemberCouple,
  createCouple,
  deleteCouple,
};
