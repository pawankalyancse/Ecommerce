let multer = require('multer')

let multerStorage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, callBack) => {
        callBack(null, file.originalname)
    },
})
let upload = multer({ storage: multerStorage })

module.exports = upload
