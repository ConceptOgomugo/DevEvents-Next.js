import { Schema, model, models, Document, Types, Model } from "mongoose";

// Interface representing a Booking document in MongoDB
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true, // Indexed for faster querying by event
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure the referenced Event exists before saving the booking
BookingSchema.pre<IBooking>("save", async function () {
  if (this.isModified("eventId")) {
    // Dynamically access the Event model to prevent circular dependency issues
    const EventModel = models.Event || model("Event");
    const eventExists = await EventModel.exists({ _id: this.eventId });

    if (!eventExists) {
      throw new Error(`Referenced event with ID ${this.eventId} does not exist.`);
    }
  }
});

// Prevent re-compilation of model during Next.js Hot Module Replacement (HMR)
const Booking: Model<IBooking> = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;