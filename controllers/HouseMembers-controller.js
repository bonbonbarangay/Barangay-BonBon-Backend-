import pool from "../dbconfig/database-setup.js";
export const createHouseMembers = async (request, response) => {
  try {
    const { data, userid } = request.body;
    const currentYear = new Date().getFullYear(); // Get the current year

    const findUser = await pool.query(
      "SELECT * FROM public.housemembers WHERE userid = $1",
      [userid]
    );

    if (findUser.rows.length > 0) {
      return response.status(400).json({
        message: "User already filled up",
      });
    }

    const insertPromises = data.map(async (values) => {
      return pool.query(
        "INSERT INTO public.housemembers (userid, year, fullname, relation, pwd, gender, age, dob, highesteducation,occupation,occupationother) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        [
          values.userid,
          currentYear,
          values.lastNameFirstName,
          values.relation,
          values.pwd,
          values.gender,
          values.age,
          values.dob,
          values.education,
          values.occupation,
          values.occupationother,
        ]
      );
    });

    await Promise.all(insertPromises);

    return response.status(201).json({
      message: "Created successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllHouseMembers = async (request, response) => {
  try {
    const getAllHouseMembers = await pool.query(
      "SELECT * FROM public.housemembers"
    );
    return response.status(201).json(getAllHouseMembers.rows);
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
