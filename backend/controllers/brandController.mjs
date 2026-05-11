import Brand from "../models/Brand.mjs";


// GET ALL
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({
      order: [["id", "DESC"]],
    });

    res.json(brands);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ADD
export const addBrand = async (req, res) => {
  try {
    const { name, status } = req.body;

    const brand = await Brand.create({
      name,
      status,
    });

    res.status(201).json({
      message: "Brand added successfully",
      brand,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    await Brand.update(
      {
        name,
        status,
      },
      {
        where: { id },
      }
    );

    res.json({
      message: "Brand updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    await Brand.destroy({
      where: { id },
    });

    res.json({
      message: "Brand deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};