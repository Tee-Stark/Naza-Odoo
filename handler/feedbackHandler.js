
const message = {
  SUCCESS: "success",
  FAILED: "failed"
}

class feedbackHandler {
  async success(res, code, msg, data = {}) {
    return await res.status(code).json({
      status: msg || message.SUCCESS,
      data: await data,
    })
  }
  async failed(res, code, msg, err = {}) {
    console.error(err); // only send the error message to the client, stack to the console
    return await res.status(code).json({
      status: `${code}, ${message.FAILED}: ${msg}`,
      error: `${err !== null ? err.message : msg}`
    });
  }
}

module.exports = new feedbackHandler();
