const odoo = require("../config/odoo");
const feedBack = require("../handler/feedbackHandler.js");
const querystring = require("querystring");

// /products `GET`
// get all products
const getProducts = async (req, res) => {
  // get `fields` query params e.g /products?fields=name,price
  const fields = req.query.fields
    ? req.query.fields.split(",")
    : [
        "name",
        "categ_id",
        "uom_id",
        "image",
        "image_small",
        "image_medium",
        "color",
        "display_name",
        "location_id",
        "rating_count",
      ];

  console.log(`Fields => ${fields}`);
  try {
    const result = await odoo.searchRead("product.product", {}, fields, {
      limit: 25,
      offset: 30,
    });
    if (!result) {
      return await feedBack.failed(res, 400, "Unable to get products", null);
    }
    await feedBack.success(res, 200, "Products returned successfully!", result);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
//get products by filter
const getProductsByFilters = async (req, res) => {
  const filterQuery = req.url.split("?")[1];
  if (!filterQuery) {
    return res.status(308).redirect("/api/products");
  }
  try {
    filters = querystring.parse(filterQuery);
    console.log(filters);
    const products = await odoo.searchRead("product.product", filters, [
      "name",
      "price",
      "image",
    ]);
    if (!products || products.length === 0) {
      return await feedBack.failed(
        res,
        404,
        "No products matching filter found!",
        null
      );
    }
    await feedBack.success(res, 200, "Success filtering products", products);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};

// /products `POST`
// create new product
const createProduct = async (req, res) => {
  const {
    name,
    type,
    image,
    image_small,
    image_medium,
    categ_id,
    price,
    uom_id,
    uom_po_id,
  } = req.body;
  //images aren't so important so we don't check for their validity yet...
  if (!name || !type || !categ_id || !price || !uom_id || !uom_po_id) {
    return await feedBack.failed(res, 400, "Missing required body!", null);
  }

  try {
    const result = await odoo.create("product.product", {
      name,
      type,
      categ_id,
      price,
      uom_id,
      uom_po_id,
      pricelist_id: 3,
      image,
      image_small,
      image_medium,
    });
    if (result) {
      return await feedBack.success(
        res,
        201,
        `New product with ID: ${result} created successfully!`,
        { product_id: result }
      );
    } else {
      await feedBack.failed(res, 500, "Unable to create new product", null);
    }
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};

// /products/:id `GET`
// get single product by ID
const getSingleProduct = async (req, res) => {
  const id = req.params.id;
  const fields = req.query.fields
    ? req.query.fields.split(",")
    : [
        "name",
        "categ_id",
        "uom_id",
        "uom_po_id",
        "image",
        "image_small",
        "image_medium",
        "product_image_ids",
        "description",
        "color",
        "rating_ids",
        "product_variant_id",
        "valid_existing_variant_ids",
        "product_template_attribute_value_ids",
        "alternative_product_ids",
        "seller_ids",
        "create_date",
        "qty_available",
        "display_name",
        "__last_update",
        "location_id",
        "rating_count",
        "rating_last_value",
        "rating_last_feedback",
        "has_discounted_amount",
        "sales_count",
        "taxes_id",
      ];
  try {
    const result = await odoo.searchRead(
      "product.product",
      {
        id: parseInt(id),
      },
      fields
      );
    if (!result) {
      return await feedBack.failed(res, 404, "Product does not exist!", null);
    }
    await feedBack.success(res, 200, "Product returned successfully", result);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
//create a product category
const addCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return await feedBack.failed(res, 400, "Missing required body!", null);
  }
  try {
    const category_id = await odoo.create("product.category", { name });
    if (!category_id) {
      return await feedBack.failed(
        res,
        400,
        "Unable to create new category!",
        null
      );
    }
    await feedBack.success(
      res,
      200,
      "Successfully created a new category of products!",
      {
        category_id: category_id,
      }
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
// get the product that belong to a category <related products>
const getRelatedProducts = async (req, res) => {
  const id = req.params.id;
  const fields = req.query.fields
    ? req.query.fields.split(",")
    : ["name", "price", "image"];
  try {
    const result = await odoo.read("product.product", parseInt(id), [
      "categ_id",
    ]);
    console.log(result);
    const category = await odoo.searchRead(
      "product.product",
      ["categ_id", "=", parseInt(result[0].categ_id)],
      fields
    );
    if (!category) {
      return await feedBack.failed(res, 404, "Invalid product category", null);
    }
    await feedBack.success(
      res,
      200,
      "Related products returned successfully!",
      category
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};

// return all category IDs
const getCategories = async (req, res) => {
  // get `fields` query params e.g /products?fields=name,price
  const fields = req.query.fields
    ? req.query.fields.split(",")
    : ["name", "complete_name", "product_count"];

  console.log(`Fields => ${fields}`);
  try {
    const result = await odoo.searchRead("product.category", {}, fields);
    if (!result) {
      return await feedBack.failed(res, 404, "Categories not found!", null);
    }
    await feedBack.success(
      res,
      200,
      "Successfully returned all categories",
      result
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
// /products/:id `DELETE`
// delete a single product
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await odoo.delete("product.product", id);

    // checks if `result` returns true
    if (!result) {
      return await feedBack.failed(res, 400, "Product not deleted!", null);
    }
    await feedBack.success(res, 200, "Product deleted successfully", result);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};

// /products/:id `UPDATE`
// updatea single product
const updateProduct = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  try {
    const result = await odoo.update("product.product", parseInt(id), body);
    // checks if `result` returns true
    if (!result) {
      return await feedBack.failed(res, 304, "Unable to update product!", null);
    }
    await feedBack.success(res, 200, "Product updated successfully!", result);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};

// best selling products --> assuming a best sellimg product is one with more than 30 sales
const bestSellingProducts = async (req, res) => {
  // get `fields` query params e.g /products?fields=name,price
  const fields = req.query.fields
    ? req.query.fields.split(",")
    : ["name", "standard_price"];
  try {
    const result = await odoo.searchRead(
      "product.product",
      [["sales_count", ">", 30]],
      fields
    );
    if (!result || result.length <= 0) {
      return await feedBack.failed(
        res,
        404,
        "There are no best selling products at this time!",
        null
      );
    }
    await feedBack.success(
      res,
      200,
      "Best selling products returned successfully!",
      result
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
//search for products
const searchProduct = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return await feedBack.failed(
      res,
      400,
      "Enter a name to search with!",
      null
    );
  }
  try {
    const searchResults = await odoo.searchRead(
      "product.product",
      ["name", "ilike", `${name}`],
      ["name", "price", "pricelist_id", "image"]
    );
    if (!searchResults) {
      return await feedBack.failed(res, 404, "No results!", null);
    }
    await feedBack.success(
      res,
      200,
      "Search results returned successfully!",
      await searchResults
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
//get products by category
const getProductsByCategory = async (req, res) => {
  const category_id = req.params.id;
  const fields = req.query.fields
    ? req.query.fields.split(",")
    : ["name", "type", "image_1920"];
  try {
    const products = await odoo.searchRead(
      "product.product",
      ["categ_id", "=", parseInt(category_id)],
      fields
    );
    if (!products || products.length === 0) {
      return await feedBack.failed(
        res,
        404,
        "No products belong to this category!",
        null
      );
    }
    await feedBack.success(
      res,
      200,
      `Successfully returned products under category ${category_id}`,
      products
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
/*
//to review a product
const giveReview = async (req, res) => {
  const {
    res_id,
    res_model,
    rating,
    feedback
  } = req.body;
  try {
    const result = await odoo.create("rating.rating", {
      res_id,
      res_model,
      rating,
      feedback
    });
    if(!result) {
      return await feedBack.failed(res, 500, "Unable to review product", null);
    }
    await feedBack.success(res, 200, "Successfully reviewed product!", result);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
}
*/
//to get all product's reviews
const getProductReviews = async (req, res) => {
  const id = req.params.id;
  try {
    const reviews = await odoo.searchRead(
      "rating.rating",
      { res_model: "product.product", res_id: parseInt(id) },
      ["res_name", "rating", "rating_text", "feedback"]
    );
    if (!reviews || reviews.length <= 0) {
      return await feedBack.failed(
        res,
        404,
        "No reviews for this product yet!",
        null
      );
    }
    await feedBack.success(res, 200, "Reviews returned successfully!", reviews);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};

module.exports = {
  getProducts,
  getProductsByFilters,
  getRelatedProducts,
  createProduct,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  addCategory,
  getRelatedProducts,
  getCategories,
  bestSellingProducts,
  searchProduct,
  getProductsByCategory,
  getProductReviews,
  //giveReview
};
