
const message = {
  SUCCESS: "success",
  FAILED: "failed"
}

class feedbackHandler {
  success(res, code, msg, data = {}) {
    console.log(data);
    return res.status(code).json({
      status: msg || message.SUCCESS,
      data,
    });
  }
  failed(res, code, msg, err = {}) {
    console.error(err); // only send the error message to the client, stack to the console
    return res.status(code).json({
      status: message.FAILED,
      error: `${err !== null ? err.message : msg}`
    });
  }
}

module.exports = new feedbackHandler();
