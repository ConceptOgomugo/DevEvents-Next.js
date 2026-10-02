import { Schema, model, models, Document, Types, Model } from "mongoose";
import Event from "./event.model";

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
    const eventExists = await Event.exists({ _id: this.eventId });

    if (!eventExists) {
      throw new Error(`Referenced event with ID ${this.eventId} does not exist.`);
    }
  }
});

function queryUpdateTouchesPaths(update: unknown, protectedPaths: string[]): boolean {
  if (Array.isArray(update)) return true;
  if (!update || typeof update !== "object") return false;

  const matchesPath = (path: string) =>
    protectedPaths.some(
      (protectedPath) =>
        path === protectedPath ||
        path.startsWith(`${protectedPath}.`) ||
        protectedPath.startsWith(`${path}.`)
    );

  return Object.entries(update).some(([operator, value]) => {
    if (!operator.startsWith("$")) return matchesPath(operator);
    if (!value || typeof value !== "object" || Array.isArray(value)) return true;

    return Object.entries(value).some(
      ([path, target]) =>
        matchesPath(path) ||
        (operator === "$rename" && typeof target === "string" && matchesPath(target))
    );
  });
}

for (const operation of ["updateOne", "updateMany", "findOneAndUpdate"] as const) {
  BookingSchema.pre(operation, function () {
    if (this.getOptions().overwrite || queryUpdateTouchesPaths(this.getUpdate(), ["eventId"])) {
      throw new Error("Update Booking eventId with document save operations.");
    }
  });
}

for (const operation of ["replaceOne", "findOneAndReplace"] as const) {
  BookingSchema.pre(operation, function () {
    throw new Error("Replace Booking documents with document save operations.");
  });
}

// Prevent re-compilation of model during Next.js Hot Module Replacement (HMR)
const Booking: Model<IBooking> = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;