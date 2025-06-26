const Message = require('../models/message.model');
const User = require('../models/user.model');
const cloudinary = require('../lib/cloudinary');
const { getReceiverSocketId, io } = require('../lib/socket');

const getUsers = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('contacts', 'fullName email avatar');
        res.status(200).json({ success: true, users: user.contacts })
    } catch (error) {
        console.log("Get Users Error: ", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id
        const user = await User.findById(myId)
        if (!user.contacts.includes(userToChatId)) {
            return res.status(403).json({ success: false, message: 'Not a contact' })
        }
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        })
        res.status(200).json({ success: true, messages: messages })
    } catch (error) {
        console.log("Message Receiving Error: ", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id
        const user = await User.findById(senderId)
        if (!user.contacts.includes(receiverId)) {
            return res.status(403).json({ success: false, message: 'Not a contact' })
        }
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save()
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        res.status(201).json({ success: true, message: newMessage })
    } catch (error) {
        console.log("Message Sending Error: ", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

module.exports = {
    getUsers,
    getMessage,
    sendMessage
}