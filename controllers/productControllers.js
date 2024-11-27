const upload = require("../multer");

const productModel = require("../models/ProductSchema");
const billModel = require("../models/billSchema");
var QRCode = require("qrcode");
const http = require("http");

const createProduct = async (req, res) => {
  // var opts = {
  //     errorCorrectionLevel: 'H',
  //     type: 'image/jpeg',
  //     quality: 0.3,
  //     margin: 1,
  //     color: {
  //       dark:"#010599FF",
  //       light:"#FFBF60FF"
  //     }
  //   }

  //  console.log(req.file)
  //  console.log(req.body)
  let ProductQr = await QRCode.toDataURL(req.body.ProductId);
  //    console.log(ProductQr)

  let ProductImage = req.file.path;
  let {
    ProductId,
    ProductName,
    ProductPrice,
    ProductQuantity,
    ProductCategory,
  } = req.body;
  let createdProduct = await productModel.create({
    ProductId,
    ProductName,
    ProductPrice,
    ProductImage,
    ProductQr,
    ProductQuantity,
    ProductCategory,
  });
  // console.log(createdProduct);
  // res.send("data inserted")
  req.flash("success", "Product Added Succesfully");

  res.redirect("/");
};
const showProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  const limit = 5;
  const skip = (page - 1) * limit;
  let search = { ProductName: "bat", ProductPrice: 300 };
  let ans = await productModel.find({}).skip(skip).limit(limit);
  //  console.log(ans);
  //  console.log(ans.ProductImage)
  const documentCount = await productModel.countDocuments();

  //  console.log(ans)
  res.render("bill - Copy", {
    ans,
    pagecount: Math.ceil(documentCount / limit),
    count: documentCount,
  });
};

const searchProduct = async (req, res) => {
  let searchTerm = req.query.q;
  try {
    let result = await productModel.find({
      ProductName: new RegExp(searchTerm, "i"),
    });
    // let result=await productModel.findOne({ProductId:searchTerm})
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error occured while fethcing");
  }
};
const qrSearchProduct = async (req, res) => {
  let searchTerm = req.query.q;
  try {
    let result = await productModel.findOne({ ProductId: searchTerm });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error occured while fethcing");
  }
};
const deleteProduct = async (req, res) => {
  let deleteTerm = req.query.q;
  try {
    let deletedResult = await productModel.deleteOne({
      ProductName: new RegExp(deleteTerm, "i"),
    });
    res.send(`deleted count= ${deletedResult.deletedCount}`);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error while deleting");
  }
};
const renderDelete = (req, res) => {
  res.render("delete2");
};
const renderUpdate = (req, res) => {
  // res.render('updateProduct')
  res.render("update-copy");
};
const updateProduct = async (req, res) => {
  try {
    let data = req.body;
    console.log(data);
    let img = "";
    if (req.file != undefined || req.file != null) img = req.file.path;
    console.log(img);

    let ProductQr = await QRCode.toDataURL(req.body.productId);

    const updateFields = {
      // Include other fields you want to update
      ProductName: data.productName,
      ProductPrice: data.price,
      ProductQr: ProductQr,
      ProductQuantity: data.quantity,
      ProductCategory: data.productCategory,
      ...(img && { ProductImage: img }),
    };
    let prod = await productModel.findOneAndUpdate(
      { ProductId: data.productId },
      {
        $set: updateFields,
      }
    );

    if (!prod) return res.status(201).json({ error: "Product does not exist" });
    req.flash("success1", "Product is Updated");

    res.redirect("/product/update");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchProductById = async (req, res) => {
  try {
    const pid = req.params.id;
    let prod = await productModel.findOne({ ProductId: pid });
    res.json(prod);
  } catch (err) {
    console.log(err);
    res.status(500).send("internal Server error");
  }
};

module.exports = {
  createProduct,
  showProducts,
  searchProduct,
  qrSearchProduct,
  deleteProduct,
  renderDelete,
  updateProduct,
  searchProductById,
  renderUpdate,
};
