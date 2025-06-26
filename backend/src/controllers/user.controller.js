const User = require('../models/user.model')
const cloudinary = require('../lib/cloudinary')

const updateProfile = async (req, res) => {
    try {
        const { avatar } = req.body
        const userId = req.user._id
        if (!avatar) return res.status(400).json({ success: false, message: "Profile Pic is required" })

        const uploadResponse = await cloudinary.uploader.upload(avatar)
        if (!uploadResponse) return res.status(400).json({ success: false, message: "Profile Pic is required" })

        const updatedUser = await User.findByIdAndUpdate(userId, { avatar: uploadResponse.secure_url }, { new: true })

        res.status(200).json({
            success: true, user: {
                id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                avatar: updatedUser.avatar
            },
            message: 'Login Successful'
        })
    } catch (error) {
        console.log("User Profile updation Error: ", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

module.exports = {
    updateProfile
}