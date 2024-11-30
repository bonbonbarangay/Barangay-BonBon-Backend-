import pool from "../dbconfig/database-setup.js";

export const createHousehold = async (request, response) => {
  try {
    const {
      userid,
      pending = true,
      // Default to true if not provided
      // data1
      lastnamehead1,
      firstnamehead1,
      mihead1,
      exthead1,
      addresshead1,
      dateofbirthhead1,
      agehead1,
      genderhead1,
      civilstatushead1,
      religionhead1,
      typeofidhead1,
      idnohead1,
      mobilenohead1,
      occupationhead1,
      skillshead1,
      companyaddresshead1,
      collegehead1,
      highschoolhead1,
      elementaryhead1,
      vocationalcoursehead1,
      // data2
      lastnamehead2,
      firstnamehead2,
      mihead2,
      exthead2,
      addresshead2,
      dateofbirthhead2,
      agehead2,
      genderhead2,
      civilstatushead2,
      religionhead2,
      typeofidhead2,
      idnohead2,
      mobilenohead2,
      occupationhead2,
      skillshead2,
      companyaddresshead2,
      collegehead2,
      highschoolhead2,
      elementaryhead2,
      vocationalcoursehead2,
      // data3
      members,
      children,
      // data 4
      question1,
      question2,
      renting,
      question3,
      question4,
      question5,
      question6,
    } = request.body;
    const currentYear = new Date().getFullYear(); // Get the current year

    const findUserId = await pool.query(
      "SELECT * FROM public.household WHERE userid = $1",
      [userid]
    );
    if (findUserId.rows.length > 0) {
      return response.status(400).json({
        message: "User Already fillup the form",
      });
    }
    const query = `
        INSERT INTO public.household (
          userid, pending, year,
          lastnamehead1, firstnamehead1, mihead1, exthead1, addresshead1, dateofbirthhead1, agehead1, genderhead1, civilstatushead1, religionhead1, typeofidhead1, idnohead1, mobilenohead1, occupationhead1, skillshead1, companyaddresshead1, collegehead1, highschoolhead1, elementaryhead1, vocationalcoursehead1,
          lastnamehead2, firstnamehead2, mihead2, exthead2, addresshead2, dateofbirthhead2, agehead2, genderhead2, civilstatushead2, religionhead2, typeofidhead2, idnohead2, mobilenohead2, occupationhead2, skillshead2, companyaddresshead2, collegehead2, highschoolhead2, elementaryhead2, vocationalcoursehead2,
          members, children,
          question1, question2, renting, question3, question4, question5, question6
        )
        VALUES (
          $1, $2,
          $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22,
          $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42,
          $43, $44,
          $45, $46, $47, $48, $49, $50, $51, $52
        )
        RETURNING *;
      `;

    const values = [
      userid,
      pending,
      currentYear,
      lastnamehead1,
      firstnamehead1,
      mihead1,
      exthead1,
      addresshead1,
      dateofbirthhead1,
      agehead1,
      genderhead1,
      civilstatushead1,
      religionhead1,
      typeofidhead1,
      idnohead1,
      mobilenohead1,
      occupationhead1,
      skillshead1,
      companyaddresshead1,
      collegehead1,
      highschoolhead1,
      elementaryhead1,
      vocationalcoursehead1,
      lastnamehead2,
      firstnamehead2,
      mihead2,
      exthead2,
      addresshead2,
      dateofbirthhead2,
      agehead2,
      genderhead2,
      civilstatushead2,
      religionhead2,
      typeofidhead2,
      idnohead2,
      mobilenohead2,
      occupationhead2,
      skillshead2,
      companyaddresshead2,
      collegehead2,
      highschoolhead2,
      elementaryhead2,
      vocationalcoursehead2,
      members,
      children,
      question1,
      question2,
      renting,
      question3,
      question4,
      question5,
      question6,
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return response
        .status(400)
        .json({ message: "Failed to create household" });
    }

    return response.status(201).json({
      message: "Household created successfully",
      household: result.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getAllHousehold = async (request, response) => {
  try {
    const getAllHousehold = await pool.query("SELECT * FROM public.household");
    return response.status(201).json(getAllHousehold.rows);
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const acceptPending = async (request, response) => {
  try {
    const { id } = request.params;

    const result = await pool.query(
      "UPDATE public.household SET pending = $1 WHERE id = $2 RETURNING *;",
      [false, id]
    );

    if (result.rowCount === 0) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    return response.status(200).json({
      message: "Pending status updated successfully",
      event: result.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const findById = async (request, response) => {
  try {
    const { userid } = request.params;

    const houseHold = await pool.query(
      "SELECT * FROM  public.household  WHERE userid = $1 ",
      [userid]
    );
    const houseMembers = await pool.query(
      "SELECT * FROM  public.housemembers  WHERE userid = $1 ",
      [userid]
    );

    if (houseHold.rowCount === 0 && houseMembers.rowCount === 0) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    return response.status(200).json({
      household: houseHold.rows[0],
      housemember: houseMembers.rows,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const deleteHouseHoldAndHouseMembers = async (request, response) => {
  try {
    const { userid } = request.params;

    const deleteHouseHold = await pool.query(
      "DELETE FROM public.household WHERE userid = $1;",
      [userid]
    );

    const deleteHouseMembers = await pool.query(
      "DELETE FROM public.housemembers WHERE userid = $1;",
      [userid]
    );
    if (deleteHouseHold.rowCount === 0 && deleteHouseMembers.rowCount === 0) {
      return response.status(404).json({
        message: "HouseHold and HouseMembers  not found or already deleted.",
      });
    }

    return response.status(200).json({
      message: "HouseHold and HouseMembers deleted successfully.",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
