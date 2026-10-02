import { Schema, model, models, Document, Model } from "mongoose";

// Interface representing an Event document in MongoDB
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, "Event mode is required"],
      trim: true,
    },
    audience: {
      type: String,
      required: [true, "Target audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Agenda must contain at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Tags must contain at least one item",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate slug and normalize date/time formatting
EventSchema.pre<IEvent>("save", function () {
  // 1. Regenerate slug only if the title has been modified
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars
      .replace(/[\s_-]+/g, "-")  // Replace spaces/underscores with dashes
      .replace(/^-+|-+$/g, "");   // Trim leading/trailing dashes
  }

  // 2. Validate and normalize date string to ISO format (YYYY-MM-DD)
  if (this.isModified("date")) {
    const parsedDate = new Date(this.date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format provided.");
    }
    this.date = parsedDate.toISOString().split("T")[0];
  }

  // 3. Normalize time string to uppercase standard 12-hour format (e.g. 09:00 AM)
  if (this.isModified("time")) {
    this.time = this.time.trim().toUpperCase();
  }
});

// Prevent re-compilation of model during Next.js Hot Module Replacement (HMR)
const Event: Model<IEvent> = models.Event || model<IEvent>("Event", EventSchema);

export default Event;