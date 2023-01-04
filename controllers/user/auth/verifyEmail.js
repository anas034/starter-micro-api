const { isValidObjectId } = require("mongoose");
const User = require("../../../models/user/User");
const verifyEmailModel = require("../../../models/tokens/varificationEmailToken");


const verifyEmail = async (req, res) => {
    const { otp } = req.body;
    const { userId, tokenId } = req
    try {
        const user = await User.findById(userId)
        if (user.verified) {
            return res.status(400).send({ success: false, message: 'User email is already verified' })
        }
        if (!otp) {
            return res.status(404).send({ success: false, message: 'OTP not found in body' })
        }
        const token = await verifyEmailModel.findOne({ owner: user._id })
        if (!token) {
            return res.status(400).send({ success: false, message: 'Token is expired or invalid' })
        }

        if (token.token === otp.toString()) {
            user.verified = true
            await verifyEmailModel.findByIdAndDelete(token._id)
            await user.save()

            res.status(200).send({ success: true, message: 'Email successfully verified!', verified: true })
            return

        }
        else {
            res.status(402).send({ success: false, message: 'Invalid Token' })
            return
        }

    } catch (error) {
        res.status(401).send({ success: false, message: 'something went wrong' })
        return

    }


}


module.exports = verifyEmail