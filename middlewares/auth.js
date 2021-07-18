var jwt = require("jsonwebtoken");
const feedBack = require("../handler/feedbackHandler.js");
var config = process.env;

const secret = config.JWT_SECRET || "verySecretValue";

const authorize = async (req, res, next) => {
  var token =
    req.headers["x-access-token"] || req.get("Authorization").split(" ")[1];
  if (!token) {
    return await feedBack.failed(
      res,
      403,
      "Token is required for verification",
      {
        statusCode: 403,
        auth: false,
        description: "You must provide a token to authenticate your call",
      }
    );
  }

  jwt.verify(token, secret, async function(err, decoded) {
    if (err) {
      return await feedBack.failed(res, 401, "Invalid token!", {
        statusCode: 401,
        auth: false,
        description: "You entered an invalid token",
      });
    }

    req.decoded = decoded;
    // console.log(req.user);
    next();
  });
};

module.exports = authorize;
