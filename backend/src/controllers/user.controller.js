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

const getContacts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('contacts', 'fullName email avatar');
        res.status(200).json({ success: true, contacts: user.contacts });
    } catch (error) {
        console.log("Get Contacts Error: ", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const addContact = async (req, res) => {
    try {
        const { contactId } = req.body;
        if (!contactId) return res.status(400).json({ success: false, message: 'Contact ID is required' });
        if (contactId === String(req.user._id)) return res.status(400).json({ success: false, message: 'Cannot add yourself as a contact' });
        const user = await User.findById(req.user._id);
        if (user.contacts.includes(contactId)) {
            return res.status(400).json({ success: false, message: 'Contact already exists' });
        }
        user.contacts.push(contactId);
        await user.save();
        res.status(200).json({ success: true, message: 'Contact added successfully' });
    } catch (error) {
        console.log("Add Contact Error: ", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const findUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
        const user = await User.findOne({ email }).select('fullName email avatar _id');
        if (!user) return res.status(404).json({ success: false, message: 'User not found - backend' });
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Find User By Email Error: ", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = {
    updateProfile,
    getContacts,
    addContact,
    findUserByEmail
}