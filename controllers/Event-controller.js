import pool from "../dbconfig/database-setup.js";
import cloudinary from "../services/cloudinary.js";

export const createEvent = async (request, response) => {
  try {
    const { title, date, location, description, image } = request.body;
    const uploadedResponse = await cloudinary.v2.uploader.upload(image, {
      upload_preset: "",
    });

    if (!uploadedResponse) {
      return response.status(400).json({
        message: "cloudinary error",
      });
    }
    const createEvent = await pool.query(
      "INSERT INTO public.event (title, date, location, description, image, cloudinaryid ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        title,
        date,
        location,
        description,
        uploadedResponse.url,
        uploadedResponse.public_id,
      ]
    );

    if (!createEvent) {
      return response.status(400).json({ message: "error create" });
    }
    return response.status(201).json({
      message: "Event created successfully",
      event: createEvent.rows[0],
    });
  } catch (error) {
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
    const { title, date, location, description, image, cloudinaryid } =
      request.body;
    const { id } = request.params;

    let imageUrl;
    let cloudinaryId;

    const eventResult = await pool.query(
      "SELECT image, cloudinaryid FROM public.event WHERE id = $1",
      [id]
    );
    if (eventResult.rowCount === 0) {
      return response.status(404).json({
        message: "Official not found",
      });
    }

    if (eventResult.rows[0].image == image) {
      imageUrl = eventResult.rows[0].image;
      cloudinaryId = eventResult.rows[0].cloudinaryid;
    } else {
      await cloudinary.v2.uploader.destroy(cloudinaryid);
      const uploadImageUpdate = await cloudinary.v2.uploader.upload(image, {
        upload_preset: "",
      });

      if (!uploadImageUpdate) {
        return response.status(400).json({
          message: "Cloudinary upload error",
        });
      }
      imageUrl = uploadImageUpdate.url;
      cloudinaryId = uploadImageUpdate.public_id;
    }

    const updateEvent = await pool.query(
      "UPDATE public.event SET title = $1,  date = $2 , location = $3, description = $4, image = $5, cloudinaryid = $6  WHERE id = $7 RETURNING *;",
      [title, date, location, description, imageUrl, cloudinaryId, id]
    );
    if (updateEvent.rowCount === 0) {
      return response.status(404).json({
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
export const deleteEvent = async (request, response) => {
  try {
    const { cloudinaryid } = request.body;
    const { id } = request.params;
    if (cloudinaryid) {
      await cloudinary.v2.uploader.destroy(cloudinaryid);
    }

    const deleteResult = await pool.query(
      "DELETE FROM public.event WHERE id = $1;",
      [id]
    );

    if (deleteResult.rowCount === 0) {
      return response.status(404).json({
        message: "Event not found or already deleted.",
      });
    }

    return response.status(200).json({
      message: "Event deleted successfully.",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
