const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/vender", { useNewUrlParser: true });
const User = require("./model/users");
const cat = require("./model/catagory");
const product = require("./model/product");
const cors = require("cors");
var bcrypt = require("bcrypt");
const crypto = require("crypto");
const BCRYPT_SALT_ROUNDS = 12;
app.use(cors());

const { check, body, validationResult } = require("express-validator/check");
const nodemailer = require("nodemailer");

const multer = require("multer");
// const op=server.op
var jwt = require("jsonwebtoken");
var upload = multer({
  dest: "uploads/"
  // fileFilter: function(req, file, cb) {
  //   var filetypes = /jpeg|jpg|json/;
  //   var mimetype = filetypes.test(file.mimetype);
  //   var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //   if (mimetype && extname) {
  //     return cb(null, true);
  //   }
  //   cb(
  //     "Error: File upload only supports the following filetypes - " + filetypes
  //   );
  // }
});

/*  */
const verifyToken = (req, res, next) => {
  console.log(req.headers["authorization"]);
  if (!req.headers["authorization"]) {
    return res.status(401).json({
      message: "unauthorize access"
    });
  }
  const token = req.headers["authorization"].replace("Bearer ", "");
  jwt.verify(token, "nikita", function(err, decoded) {
    if (err) {
      return res.status(401).json({
        message: "Invalid token"
      });
    }
    req.currentUser = decoded;
    next();
  });
};

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post(
  "/addUser",
  upload.single("file"),

  //name validation
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name can't be empty"),
    //Email validation
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email can't be empty")
      .isEmail()
      .withMessage("Enter the valid email")
      .normalizeEmail()
      .trim()
      .custom(async (email, { req, res }) => {
        const userData = await User.findOne({ email });
        console.log(userData);
        if (userData) {
          throw new Error("Email address already exist.");
        }
      }),

    check("password")
      .not()
      .isEmpty()
      .withMessage("Password cant be empty")
      .isLength({ min: 6 })
      .withMessage("must be at least 6 chars long")
      .isLength({ max: 10 })
      .withMessage("max length of password is 10")
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Password confirmation is incorrect");
        } else {
          return value;
        }
      })
      .withMessage("password didn't match"),

    // Mobile validation
    check("mobile_no")
      .not()
      .isEmpty()
      .withMessage("Mobile no. cant be empty")
      .isInt()
      .withMessage("character not allowed")
      .isLength({ min: 7 })
      .withMessage("Mobile no. at list 7 digit long")
      .isLength({ max: 14 })
      .withMessage("Mobile no. max length is 14"),
    check("category")
      .not()
      .isEmpty()
      .withMessage("Category is required"),
    check("idProof")
      .not()
      .isEmpty()
      .withMessage("Idproof is required")
    // check("file")
    //   .not()
    //   .isEmpty()
    //   .withMessage("image is required")
  ],
  async (req, res) => {
    // First read existing users.
    const errors = validationResult(req);
    console.log(req);
    console.log(errors);
    console.log("errors");
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: errors.array(),
        success: false
      });
    }

    try {
      const { body, file } = req;
      const Password = req.body.password;
      const salt = bcrypt.genSaltSync(5);
      const hash = bcrypt.hashSync(Password, salt);
      req.body.password = hash;
      const user = new User({
        ...body,
        file: `${file.destination}${file.filename}`,
        password: hash
      });
      const result = await user.save();
      if (!result) {
        res.status(500).json({
          message: "data did't get"
        });
      } else if (result) {
        const object = { ...result._doc };
        var token = jwt.sign(object, "nikita", { expiresIn: "1h" });
        res.status(200).json({
          token,
          files: req.file,
          body: req.body,
          result,
          message: "Data get."
        });
        var transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "minal.chapter247@gmail.com",
            pass: "minal@247"
          }
        });
        var mailOptions = {
          from: "minal.chapter247@gmail.com",
          to: req.body.email,
          subject: "SignUp ",
          text: "Welcome " + req.body.name + " you are sucessfully Registerd ! "
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
            res.status(200).json({
              result,
              message: "Mail sent sucessfully"
            });
          }
        });
      }
    } catch (error) {
      res.status(500).json({
        message:
          errors.message ||
          "An unexpected error occure while processing your request."
      });
    }
  }
);
app.get("/users", async (req, res) => {
  // First read existing users.
  try {
    //const result = await User.find();
    const result1 = await cat.find();
    res.status(200).json({
      result1,
      message: "Data get."
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request."
    });
  }
});

app.get("/getuser", async (req, res) => {
  // First read existing users.
  try {
    const result1 = await User.find();
    res.status(200).json({
      result1,
      message: "Data get."
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request."
    });
  }
});
app.post("/profile", async (req, res) => {
  // First read existing users.
  try {
    const { body, file } = req;
    const value = req.body.cId;
    const result = await User.findOne({ _id: value });
    res.status(200).json({
      result,
      message: "Data get."
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request."
    });
  }
});
app.put(
  "/editProfile",
  verifyToken,
  upload.single("file"),
  async (req, res) => {
    // First read existing users.
    try {
      const { body, file } = req;
      let obj = body;
      if (body.imageUpdated === "true") {
        obj = {
          ...obj,
          file: `${file.destination}${file.filename}`
        };
      }
      const value = req.body.cId;
      const result = await User.findOneAndUpdate({ _id: value }, { $set: obj });
      res.status(200).json({
        files: req.file,
        body: req.body,
        result,
        message: "Data get."
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message ||
          "An unexpected error occure while processing your request."
      });
    }
  }
);

app.post(
  "/login",
  [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email can't be empty")
      .isEmail()
      .withMessage("Enter the valid email")
      .trim()
      .normalizeEmail(),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password can't be empty")
  ],
  async (req, res) => {
    try {
      const { body } = req;
      const Email = body.email;
      const Password = body.password;
      const result = await User.findOne({ email: Email });
      console.log(result);
      if (!result) {
        res.status(400).json({
          message: "Email is not registerd.",
          success: false
        });
      }
      const check = bcrypt.compareSync(Password, result.password);
      if (!check) {
        res.status(400).json({
          message: "password didn't match.",
          success: false
        });
      } else {
        const object = { ...result._doc };
        var token = jwt.sign(object, "nikita", { expiresIn: "1h" });
        res.status(200).json({
          token,
          result,
          message: "Logged in successfully!",
          success: true
        });
      }
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message || "unwanted error occurred."
      });
    }
  }
);

app.delete("/user/:userId", async (req, res) => {
  // First read existing users.
  try {
    const { params } = req;
    const result = await User.findByIdAndDelete(params.userId);
    res.status(200).json({
      result,
      message: "Data get."
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request."
    });
  }
});

app.post("/addimage", upload.single("file"), async (req, res) => {
  const result = await User.save(req.filename);
  try {
    res.status(200).json({
      result,
      files: req.file,
      body: req.body
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
app.post(
  "/addProduct",
  verifyToken,
  upload.single("file"),
  [
    check("productDetail")
      .not()
      .isEmpty(),
    check("productTitle")
      .not()
      .isEmpty(),
    check("productPrice")
      .not()
      .isEmpty(),
    check("productSellingPrice")
      .not()
      .isEmpty(),
    check("file")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    try {
      const { body, file } = req;
      const Product = new product({
        ...body,
        file: `${file.destination}${file.filename}`
      });
      const result = await Product.save();
      console.log(result);
      if (!result) {
        res.status(400).json({
          result,
          message: "product is not Listed."
        });
      } else if (result) {
        res.status(200).json({
          result,
          files: req.file,
          body: req.body
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message || "error occured !"
      });
    }
  }
);
app.post("/showproduct", upload.single("file"), async (req, res) => {
  try {
    const value = req.body.cId;
    const result = await product.find({ cId: value });
    res.status(200).json({
      message: "here is your data",
      result
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
app.put("/updatePproduct", upload.single("file"), async (req, res) => {
  try {
    const { body, file } = req;
    const result = await product.findOneAndUpdate(
      { cId: value },
      {
        $set: {
          ...body,
          file: `${file.destination}${file.filename}`
        }
      }
    );
    res.status(200).json({
      result,
      files: req.file,
      body: req.body
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
app.get("/getitem/:_id", async (req, res) => {
  try {
    const result = await product.findById({ _id: req.params._id });

    res.status(200).json({
      files: req.file,
      body: req.body,
      result,
      message: "Data found."
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "unwanted error occured"
    });
  }
});
app.post("/viewitem/:_id", upload.single("file"), async (req, res) => {
  // First read existing users.
  try {
    const result = await product.findById({ _id: req.params._id });

    res.status(200).json({
      files: req.file,
      result,
      message: "Data get."
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request."
    });
  }
});
app.delete("/deleteitem/:_id", async (req, res) => {
  try {
    const { params } = req;
    const result = await product.findByIdAndDelete({ _id: req.params._id });
    res.status(200).json({
      message: "item Deleted."
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occure while processing your request."
    });
  }
});
app.put(
  "/edititem/:_id",
  upload.single("file"),
  [
    check("productPrice")
      .not()
      .isEmpty()
      .withMessage("Price is neccessary !"),
    check("productSellingPrice")
      .not()
      .isEmpty()
      .withMessage("selling price should not be empty.")
  ],
  async (req, res) => {
    try {
      const { body, file } = req;
      let obj = body;
      console.log(body);
      if (body.imageUpdated === "true") {
        console.log("in if");
        obj = {
          ...obj,
          file: `${file.destination}${file.filename}`
        };
      }
      const result = await product.findByIdAndUpdate(
        { _id: req.params._id },
        { $set: obj }
      );
      res.status(200).json({
        body: req.body,
        files: req.file,
        result,
        message: "data updated"
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Internal error !"
      });
    }
  }
);
app.post(
  "/forgotPassword",
  [
    check("email")
      .not()
      .isEmpty()
      .trim()
      .normalizeEmail()
  ],
  async (req, res) => {
    if (req.body.email === "") {
      res.status(400).send("email required");
    }
    console.error(req.body.email);
    const user = await User.findOne({
      email: req.body.email
    });
    if (!user) {
      console.error("email not in database");
      res.status(403).send("email not in db");
    } else {
      const token = crypto.randomBytes(20).toString("hex");
      const user = await User.findOneAndUpdate(
        { email: req.body.email },
        {
          $set: {
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 600000
          }
        }
      );
      // res.status(200).json({
      //   user,
      //   message: "data get"
      // });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "minal.chapter247@gmail.com",
          pass: "minal@247"
        }
      });

      const mailOptions = {
        from: "minal.chapter247@gmail.com",
        to: `${user.email}`,
        subject: "Link To Reset Password",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
          `http://192.168.2.112:3000/reset/${token}\n\n` +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n"
      };

      console.log("sending mail");

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error("there was an error: ", err);
        } else {
          console.log("here is the res: ", response);
          res.status(200).json("recovery email sent");
        }
      });
    }
  }
);

// const Op = Sequelize.Op;
app.get("/reset", async (req, res) => {
  console.log(req.query);
  console.log("Date.now()");
  console.log(Date.now());

  const user = await User.findOne({
    resetPasswordToken: req.query.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  });

  console.log("user");
  console.log(user);
  if (!user) {
    console.error("password reset link is invalid or has expired");
    res.status(403).send("password reset link is invalid or has expired");
  } else {
    res.status(200).send({
      user,
      message: "password reset link a-ok"
    });
  }
});

app.put("/updatePasswordViaEmail", async (req, res) => {
  const user = User.findOne({
    email: req.body.email,
    resetPasswordToken: req.body.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  });
  if (!user) {
    console.error("password reset link is invalid or has expired");
    res.status(403).send("password reset link is invalid or has expired");
  } else if (user != null) {
    console.log("user exists in db");
    const password = req.body.password;
    const hashedPassword = bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      {
        email: req.body.email,
        resetPasswordToken: req.body.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null
        }
      }
    );
    console.log("password");
    console.log(hashedPassword);

    if (user) {
      console.log("password updated");
      res.status(200).send({ message: "password updated" });
    }
  } else {
    console.error("no user exists in db to update");
    res.status(401).json("no user exists in db to update");
  }
});

var server = app.listen(8000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
