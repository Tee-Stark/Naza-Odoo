const odoo = require("../config/odoo");
const feedBack = require("../handler/feedbackHandler.js");
const querystring = require("querystring");

// /products `GET`
// get all products
const getProducts = async (req, res) => {
  // get `fields` query params e.g /products?fields=name,price
  const fields = req.query.fields ? req.query.fields.split(",") : ["name"];

  console.log(`Fields => ${fields}`);
  try {
    const result = await odoo.searchRead("product.product", undefined, fields, {
      limit: 5,
      offset: 10,
    });
    if (!result) {
      return await feedBack.failed(res, 400, "Unable to get products", null);
    }
    await feedBack.success(res, 200, "Products returned successfully!");
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
    const products = await odoo.searchRead(
      "product.product",
      filters,
      ["name", "price"]
    );
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
  const { name, type, categ_id, price, uom_id, uom_po_id } = req.body;
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
    : ["name", "categ_id"];
  try {
    const result = await odoo.searchRead(
      "product.product",
      { id: parseInt(id) },
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
    : ["name", "price"];
  try {
    const result = await odoo.read(
      "product.product",
      parseInt(id), ["categ_id"]
    );
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
  const fields = req.query.fields ? req.query.fields.split(",") : ["categ_id"];

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

// best selling products --> a bst sellimg product is one with more than 5 sale orders
const bestSellingProducts = async (req, res) => {
  // get `fields` query params e.g /products?fields=name,price
  const fields = req.query.fields
    ? req.query.fields.split(",")
    : ["name", "standard_price"];
  console.log(`Fields => ${fields}`);
  try {
    /*const order_ids = await odoo.searchRead(
      "purchase.order",
      ["sale_order_count", ">", 5],
      ["id"]
    );*/
    //console.log(order_ids);
    let results = [];
    //order_ids.forEach(async (id) => {
    //console.log(id);
    const result = await odoo.read(
      "purchase.order",
      [parseInt(id)],
      ["product_id"]
    );
    results.push(result);
    // });
    if (!results) {
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
      ["name", "price"]
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
    : ["name", "type"];
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
};
