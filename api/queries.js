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
    notes
  } = request.body;

  pool.query(
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

  // Need to delete all check in dates for the member before deleting the member. Cascade is weird. 
  pool.query("DELETE FROM dates WHERE member_id = $1", [id], (error, results) => {
    if(error){
      throw error; 
    }
  })

  pool.query("DELETE FROM couples WHERE member_id_1 = $1 OR member_id_2 = $1", [id], (error, results) => {
    if(error){
      throw error; 
    }
  })

  pool.query("SELECT id FROM members WHERE NOT EXISTS (SELECT 1 FROM couples WHERE couples.member_id_1 = members.id OR couples.member_id_2 = members.id)", (error, results)=> {
    if(error){
      throw error
    }
    let singles = []

    results.rows.map((single)=> {
      singles.push(single.id)
    })
    let query = `UPDATE members SET relationship_status = $1 WHERE id IN (${singles.join(',')})`
    pool.query(query, ["Single"], (error, results)=> {
      if(error){
        throw error
      }
    })
  })

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
const checkinMember = (request, response) => {
  const id = parseInt(request.params.id);
  console.log(id)
  pool.query(
    `INSERT INTO dates (member_id) VALUES ($1)`,[id], (error, results) => {
      if(error){
        throw error
      }
      response.status(201).send(`User checked in today with ID: ${id}`)
    }
  )
}

const queryMember = (request, response) => {
  let query = "SELECT id, first_name, last_name, sex, relationship_status, TO_CHAR(birth_date :: DATE, 'dd/mm/yyyy') birth_date, TO_CHAR(expiry_date :: DATE, 'dd/mm/yyyy') expiry_date FROM members "
  const params = request.query
  if (Object.keys(params)) {
    query += "WHERE "
    let first = true
    Object.entries(params).map(([key, val]) => {
      query += first ? `${key}='${val}'` : ` AND ${key}='${val}'`
      first = false
    })
  }
  pool.query(
    query, (error, results) => {
      if(error){
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

const createCouple = (request, response) => {
  let {member_1, member_2} = request.body

  pool.query("UPDATE members SET relationship_status = $1 WHERE id IN ($2, $3)", ['Couple',member_1, member_2], (error, results) => {
    if(error){
      throw error
    }
    console.log(response)
  })

  pool.query("INSERT into couples (member_id_1, member_id_2) VALUES ($1, $2)", [member_1, member_2], (error, results)=> {
    if(error){
      throw error
    }
    response.status(201).send(`Users ${member_1} and ${member_2} are now coupled.`)
  })
}

const getMemberCouple = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(`SELECT * FROM couples WHERE member_id_1 = ${id} OR member_id_2 = ${id}`, (error, results)=> {
    if(error){
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCouples = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(`SELECT * FROM couples`, (error, results)=> {
    if(error){
      throw error
    }
    response.status(200).json(results.rows)
  })
}

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
};
