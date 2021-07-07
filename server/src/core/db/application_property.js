import mongoose from 'mongoose';

const { model, Schema } = mongoose;
const applicationPropertySchema = new Schema({
  key: {
    type: Schema.Types.String, required: true, unique: true, index: true,
  },
  value: { type: Schema.Types.String, required: true },
});

export default model('ApplicationProperty', applicationPropertySchema);
