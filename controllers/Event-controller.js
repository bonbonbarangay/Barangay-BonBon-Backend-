import pool from "../dbconfig/database-setup.js";

export const createEvent = async (request, response) => {
  try {
    const { title, date } = request.body;
    console.log(title, date);

    const createEvent = await pool.query(
      "INSERT INTO public.event (title, date) VALUES ($1, $2) RETURNING *",
      [title, date]
    );

    if (createEvent.rowCount === 0) {
      return response.status(400).json({ message: "Failed to create event" });
    }

    return response.status(201).json({
      message: "Created successfully",
      event: createEvent.rows[0],
    });
  } catch (error) {
    // Handle any errors
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllEvent = async (request, response) => {
  try {
    const getAllEvent = await pool.query("SELECT * FROM public.event");
    return response.status(201).json(getAllEvent.rows);
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateEvent = async (request, response) => {
  try {
    const { title, date } = request.body;
    const { id } = request.params;

    const updateEvent = await pool.query(
      "UPDATE public.event SET title = $1, date = $2 WHERE id = $3 RETURNING *;",
      [title, date, id]
    );

    if (updateEvent.rowCount === 0) {
      return response.status(400).json({
        message: "Official not found",
      });
    }

    return response.status(200).json({
      message: "Official updated successfully",
      event: updateEvent.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
