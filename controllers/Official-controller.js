import cloudinary from "../services/cloudinary.js";
import pool from "../dbconfig/database-setup.js";

export const createOfficial = async (request, response) => {
  try {
    const { fullname, position, type, image } = request.body;

    const findName = await pool.query(
      "SELECT * FROM public.officials WHERE fullname = $1",
      [fullname]
    );
    if (findName.rows.length > 0) {
      return response.status(400).json({
        message: "Official already exists",
      });
    }

    const uploadedResponse = await cloudinary.v2.uploader.upload(image, {
      upload_preset: "",
    });

    if (!uploadedResponse) {
      return response.status(400).json({
        message: "cloudinary error",
      });
    }
    const createOfficial = await pool.query(
      "INSERT INTO public.officials (fullname,position,type,image,cloudinaryid) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        fullname,
        position,
        type,
        uploadedResponse.url,
        uploadedResponse.public_id,
      ]
    );

    if (!createOfficial) {
      return response.status(400).json({ message: "error create" });
    }
    return response.status(201).json({
      message: "created successfully",
      event: createOfficial.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllOfficials = async (request, response) => {
  try {
    const getAllOfficial = await pool.query("SELECT * FROM public.officials");

    return response.status(200).json(getAllOfficial.rows);
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getOfficialByPositionType = async (request, response) => {
  try {
    const { positiontype } = request.body;
    const getOfficialByPosition = await pool.query(
      "SELECT * FROM public.officials WHERE type = $1",
      [positiontype]
    );

    return response.status(200).json(getOfficialByPosition.rows);
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const updateOfficial = async (request, response) => {
  try {
    const { fullname, position, type, image, cloudinaryid } = request.body;
    const { id } = request.params;

    let imageUrl;
    let cloudinaryId;

    const officialResult = await pool.query(
      "SELECT image, cloudinaryid FROM public.officials WHERE id = $1",
      [id]
    );
    if (officialResult.rowCount === 0) {
      return response.status(404).json({
        message: "Official not found",
      });
    }

    if (officialResult.rows[0].image == image) {
      imageUrl = officialResult.rows[0].image;
      cloudinaryId = officialResult.rows[0].cloudinaryid;
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

    const updateAnnoucement = await pool.query(
      "UPDATE public.officials SET fullname = $1, position = $2, type = $3 , image = $4 , cloudinaryid = $5 WHERE id = $6 RETURNING *;",
      [fullname, position, type, imageUrl, cloudinaryId, id]
    );

    if (updateAnnoucement.rowCount === 0) {
      return response.status(404).json({
        message: "Official not found",
      });
    }

    return response.status(200).json({
      message: "Official updated successfully",
      event: updateAnnoucement.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const deleteOfficial = async (request, response) => {
  try {
    const { cloudinaryid } = request.body;
    const { id } = request.params;
    if (cloudinaryid) {
      await cloudinary.v2.uploader.destroy(cloudinaryid);
    }

    const deleteResult = await pool.query(
      "DELETE FROM public.officials WHERE id = $1;",
      [id]
    );

    if (deleteResult.rowCount === 0) {
      return response.status(404).json({
        message: "Official not found or already deleted.",
      });
    }

    return response.status(200).json({
      message: "Official deleted successfully.",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
