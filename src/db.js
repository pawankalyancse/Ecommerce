let mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

let isConnected = false;

const connectDB = async () => {
	if (isConnected) {
		console.log('⏩ Already connected to MongoDB');
		return;
	}
	try {
		console.log('➕ New Connection...');
		await mongoose.connect(MONGODB_URI);
	} catch (err) {
		console.error('⛔ Error connecting to MongoDB', err);
	}
};



mongoose.connection.on('connected', () => {
	isConnected = true;
	console.log('✅ Mongoose connected to DB 🔗');
});

mongoose.connection.on('disconnected', () => {
	console.warn('⚠️ Mongoose disconnected. Attempting to reconnect...');
	isConnected = false;
});


mongoose.connection.on('reconnected', () => {
	console.log('⌛ Mongoose Reconnected to DB 🔗');
	isConnected = true
});

mongoose.connection.on('error', (err) => {
	console.error('⛔ Mongoose connection error:', err);
	isConnected = false;
});

module.exports = connectDB;

