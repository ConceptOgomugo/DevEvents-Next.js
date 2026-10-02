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
    const normalizedTitle = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars
      .replace(/[\s_-]+/g, "-")  // Replace spaces/underscores with dashes
      .replace(/^-+|-+$/g, "");   // Trim leading/trailing dashes
    this.slug = `${normalizedTitle}-${this._id.toString()}`;
  }

  // 2. Validate the date-only value without converting it through a timezone
  if (this.isModified("date")) {
    const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(this.date);
    if (!dateParts) {
      throw new Error("Invalid date format provided.");
    }

    const year = Number(dateParts[1]);
    const month = Number(dateParts[2]);
    const day = Number(dateParts[3]);
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];

    if (!daysInMonth || day < 1 || day > daysInMonth) {
      throw new Error("Invalid date format provided.");
    }
  }

  // 3. Normalize time string to uppercase standard 12-hour format (e.g. 09:00 AM)
  if (this.isModified("time")) {
    this.time = this.time.trim().toUpperCase();
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
  EventSchema.pre(operation, function () {
    if (
      this.getOptions().overwrite ||
      queryUpdateTouchesPaths(this.getUpdate(), ["title", "slug", "date", "time"])
    ) {
      throw new Error("Update Event invariant fields with document save operations.");
    }
  });
}

for (const operation of ["replaceOne", "findOneAndReplace"] as const) {
  EventSchema.pre(operation, function () {
    throw new Error("Replace Event documents with document save operations.");
  });
}

// Prevent re-compilation of model during Next.js Hot Module Replacement (HMR)
const Event: Model<IEvent> = models.Event || model<IEvent>("Event", EventSchema);

export default Event;