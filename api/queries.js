const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "membership-app",
  password: "password",
  port: 5432,
});

const correctRelationship = async () => {
  return await pool.query(
    "SELECT id FROM customers WHERE NOT EXISTS (SELECT 1 FROM couples WHERE couples.customer_id_1 = customers.id OR couples.customer_id_2 = customers.id)"
  );
};

const getCustomers = async (request, response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, first_name, last_name, sex, relationship_status, id_number, TO_CHAR(birth_date :: DATE, 'dd/mm/yyyy') birth_date, TO_CHAR(expiry_date :: DATE, 'dd/mm/yyyy') expiry_date, is_member, is_banned FROM customers ORDER BY id ASC"
    );
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const getCustomerById = async (request, response) => {
  try {
    const id = parseInt(request.params.id);

    const { rows } = await pool.query(
      "SELECT id, first_name, last_name, sex, relationship_status, id_number, TO_CHAR(birth_date :: DATE, 'dd/mm/yyyy') birth_date, TO_CHAR(expiry_date :: DATE, 'dd/mm/yyyy') expiry_date, is_member, notes, is_banned, ENCODE(photo,'base64') as photo FROM customers WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      response.status(404).send("User not found.");
    } else {
      response.status(200).json(rows);
    }
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const createCustomer = async (request, response) => {
  try {
    const {
      first_name,
      last_name,
      birth_date,
      expiry_date,
      sex,
      relationship_status,
      id_number,
      photo,
      notes,
      is_member,
    } = request.body;

    const checkExists = await pool.query(
      "SELECT id FROM customers WHERE first_name = $1 AND last_name = $2 AND birth_date = $3",
      [first_name, last_name, birth_date]
    );
    if (checkExists.rowCount > 0) {
      response
        .status(400)
        .send(`User already exists with ID: ${checkExists.rows[0]["id"]}`);
      return;
    }

    const { rows } = await pool.query(
      "INSERT INTO customers (first_name, last_name, birth_date, expiry_date, sex, relationship_status, id_number, photo, notes, is_member) VALUES ($1, $2, $3, $4, $5, $6, $7, DECODE($8, 'base64'), $9, $10)",
      [
        first_name,
        last_name,
        birth_date,
        expiry_date,
        sex,
        relationship_status,
        id_number,
        photo,
        notes,
        is_member,
      ]
    );
    response.status(201).send(`User created.`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const updateCustomer = async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const {
      first_name,
      last_name,
      birth_date,
      expiry_date,
      sex,
      relationship_status,
      id_number,
      photo,
      notes,
      is_member,
    } = request.body;

    await pool.query(
      "UPDATE customers SET first_name = $1, last_name = $2, birth_date = $3, expiry_date = $4, sex = $5, relationship_status = $6, id_number = $7, photo = DECODE($8, 'base64'), notes = $9, is_member = $10 WHERE id = $11",
      [
        first_name,
        last_name,
        birth_date,
        expiry_date,
        sex,
        relationship_status,
        id_number,
        photo,
        notes,
        is_member,
        id,
      ]
    );
    response.status(200).send(`User modified with ID: ${id}`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const banCustomer = async (request, response) => {
  try {
    const id = parseInt(request.params.id);

    await pool.query("UPDATE customers SET is_banned = 'true' WHERE id = $1", [
      id,
    ]);
    response.status(200).send(`User banned with ID: ${id}`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const unbanCustomer = async (request, response) => {
  try {
    const id = parseInt(request.params.id);

    await pool.query("UPDATE customers SET is_banned = 'false' WHERE id = $1", [
      id,
    ]);
    response.status(200).send(`User banned with ID: ${id}`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const deleteCustomer = async (request, response) => {
  try {
    const id = parseInt(request.params.id);

    // Need to delete all check in dates for the customer before deleting the customer. Cascade is weird.
    await pool.query("DELETE FROM dates WHERE customer_id = $1", [id]);

    await pool.query(
      "DELETE FROM couples WHERE customer_id_1 = $1 OR customer_id_2 = $1",
      [id]
    );

    const { rows } = await correctRelationship();

    let singles = [];

    rows.map((single) => {
      singles.push(single.id);
    });

    let query = `UPDATE customers SET relationship_status = $1 WHERE id IN (${singles.join(
      ","
    )})`;

    await pool.query(query, ["Single"]);

    await pool.query("DELETE FROM customers WHERE id = $1", [id]);
    response.status(200).send(`User deleted with ID: ${id}`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const getDates = async (request, response) => {
  try {
    const { rows } = await pool.query(
      "SELECT first_name, last_name, TO_CHAR(entry_date :: DATE, 'dd/mm/yyyy') entry_date FROM dates AS t INNER JOIN customers AS m ON t.customer_id = m.id ORDER BY entry_date DESC"
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
      "SELECT first_name, last_name, TO_CHAR(entry_date :: DATE, 'dd/mm/yyyy')  entry_date FROM dates AS t INNER JOIN customers AS m ON t.customer_id = m.id WHERE entry_date = $1 ORDER BY entry_date DESC",
      [date]
    );
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const checkinCustomer = async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    await pool.query(`INSERT INTO dates (customer_id) VALUES ($1)`, [id]);
    response.status(201).send(`User checked in today with ID: ${id}`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const queryCustomer = async (request, response) => {
  try {
    const firstName = request.query.first_name;
    const lastName = request.query.last_name;
    const birth_date = request.query.birth_date;
    let queries = [];
    let querySelector = ``;
    if (firstName) {
      queries.push(`first_name ILIKE '${firstName}'`);
    }
    if (lastName) {
      queries.push(`last_name ILIKE '${lastName}'`);
    }
    if (birth_date) {
      queries.push(`birth_date = '${birth_date}'`);
    }
    if (queries.length > 0) {
      queries = queries.join(" AND ");
      querySelector = `WHERE ${queries}`;
    }

    let query =
      "SELECT id, first_name, last_name, sex, relationship_status, id_number, TO_CHAR(birth_date :: DATE, 'dd/mm/yyyy') birth_date, TO_CHAR(expiry_date :: DATE, 'dd/mm/yyyy') expiry_date FROM customers " +
      querySelector;

    const { rows } = await pool.query(query);
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const createCouple = async (request, response) => {
  try {
    let { customer_1, customer_2 } = request.body;

    await pool.query(
      "UPDATE customers SET relationship_status = $1 WHERE id IN ($2, $3)",
      ["Couple", customer_1, customer_2]
    );

    await pool.query(
      "INSERT into couples (customer_id_1, customer_id_2) VALUES ($1, $2)",
      [customer_1, customer_2]
    );

    response
      .status(201)
      .send(`Users ${customer_1} and ${customer_2} are now coupled.`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const getCustomerCouple = async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const { rows } = await pool.query(
      `SELECT * FROM couples WHERE customer_id_1 = ${id} OR customer_id_2 = ${id}`
    );
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const getCouples = async (request, response) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, customer_id_1, customer_id_2 FROM couples`
    );
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const deleteCouple = async (request, response) => {
  try {
    const { customer_1, customer_2 } = request.body;

    await pool.query(
      "DELETE FROM couples WHERE (customer_id_1 = $1 AND customer_id_2 = $2) OR (customer_id_1 = $2 AND customer_id_2 = $1)",
      [customer_1, customer_2]
    );

    const { rows } = await correctRelationship();

    let singles = [];

    rows.map((single) => {
      singles.push(single.id);
    });

    let query = `UPDATE customers SET relationship_status = $1 WHERE id IN (${singles.join(
      ","
    )})`;

    await pool.query(query, ["Single"]);

    response.status(200).send(`Couple deleted.`);
  } catch (error) {
    response.status(500).json({ error_code: error.code });
  }
};

const getMaxId = async (request, response) => {
  try {
    const { rows } = await pool.query(
      "SELECT last_value FROM customers_id_seq"
    );
    response.status(200).json(rows);
  } catch (error) {
    console.log(error)
    response.status(500).json({ error_code: error.code });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  banCustomer,
  unbanCustomer,
  getDates,
  getDate,
  queryCustomer,
  checkinCustomer,
  getCouples,
  getCustomerCouple,
  createCouple,
  deleteCouple,
  getMaxId,
};
