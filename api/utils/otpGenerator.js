const getOTP = () => {
    let otp = Math.floor(Math.random() * Math.pow(10, 6))
    if (otp < 1_00_000) {
        let digitsCount = Math.floor(Math.log10(otp)) + 1
        let diff = 6 - digitsCount
        for (let i = 0; i < diff; i++) {
            otp = `0${otp}`
        }
    }
    return otp
}
// 0.12345678 * 1000000 = 0123456.78 # logs= 9998 = log10(1000) = 3 + 1

module.exports = getOTP
