const sendResponse = (res, status, message) => {
    if (!message) { return res.sendStatus(status) }
    let data = { message }
    if (status == 200) {
        data = message
    }
    else if (status == 500) {
        data = { message: message || "Internal Server Error" }
    }
    return res.status(status).send(data)
}

module.exports = { sendResponse }