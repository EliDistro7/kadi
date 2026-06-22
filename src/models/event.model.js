const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    eventType: {
      type: String,
      enum: ['wedding', 'sendoff', 'kipaimara', 'birthday', 'other'],
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },        // e.g. "15:00"
    venue: { type: String, required: true },
    templateId: { type: String, required: true },  // e.g. "template_wedding_01"
    hostNames: { type: String },                   // "John & Jane"
    notes: { type: String },
    status: { type: String, enum: ['draft', 'active', 'closed'], default: 'draft' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
