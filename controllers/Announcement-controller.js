import pool from "../dbconfig/database-setup.js";
import cloudinary from "../services/cloudinary.js";
export const createAnnoucement = async (request, response) => {
  try {
    const { image, description } = request.body;
    const uploadedResponse = await cloudinary.v2.uploader.upload(image, {
      upload_preset: "",
    });

    if (!uploadedResponse) {
      return response.status(400).json({
        message: "cloudinary error",
      });
    }
    const createAnnoucement = await pool.query(
      "INSERT INTO public.announcement (image, description, cloudinaryid) VALUES ($1, $2, $3) RETURNING *",
      [uploadedResponse.url, description, uploadedResponse.public_id]
    );

    if (!createAnnoucement) {
      return response.status(400).json({ message: "error create" });
    }
    return response.status(201).json({
      message: "Event created successfully",
      event: createAnnoucement.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllAnnouncement = async (request, response) => {
  try {
    const getAllAnnouncement = await pool.query(
      "SELECT * FROM public.announcement"
    );

    return response.status(200).json({
      message: getAllAnnouncement.rows,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateAnnoucement = async (request, response) => {
  try {
    const { image, description, cloudinaryid } = request.body;
    const { id } = request.params;

    if (cloudinaryid) {
      await cloudinary.v2.uploader.destroy(cloudinaryid);
    }

    const uploadImageUpdate = await cloudinary.v2.uploader.upload(image, {
      upload_preset: "",
    });

    if (!uploadImageUpdate) {
      return response.status(400).json({
        message: "Cloudinary upload error",
      });
    }

    const updateAnnoucement = await pool.query(
      "UPDATE public.announcement SET image = $1, description = $2, cloudinaryid = $3 WHERE id = $4 RETURNING *;",
      [uploadImageUpdate.url, description, uploadImageUpdate.public_id, id]
    );

    if (updateAnnoucement.rowCount === 0) {
      return response.status(404).json({
        message: "Event not found",
      });
    }

    return response.status(200).json({
      message: "Event updated successfully",
      event: updateAnnoucement.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
