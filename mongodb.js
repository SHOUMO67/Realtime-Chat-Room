import mongoose from 'mongoose';

export const connectdb = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/chatter', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database is successfully connected');
  } catch (err) {
    console.log('Error to connect with database', err);
  }
};
