import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  isActive: { type: Boolean, require: true },
});

export default mongoose.model('Users', userSchema);
