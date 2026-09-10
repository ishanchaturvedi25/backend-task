const prismaClient = require('../prisma/prismaClient');
const bcrypt = require('bcrypt');

const registerUser = async (userData) => {
    const existingUser = await prismaClient.user.findUnique({
        where: { email: userData.email }
    });
    
    if (existingUser) {
        throw new Error('User already exists');
    }

    userData.password = await bcrypt.hash(userData.password, 10);
    return await prismaClient.user.create({
        data: userData
    });
};

const loginUser = async ({ email, password }) => {
    const user = await prismaClient.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    return user;
};

const getUserProfile = async (userId) => {
    const user = await prismaClient.user.findUnique({
        where: { id: userId }
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

module.exports = { registerUser, loginUser, getUserProfile };