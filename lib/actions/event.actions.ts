'use server';

import Event from "@/database/event.model";
import connectToDatabase from "../mongodb";

export const getSimilarEventBySlug = async (slug: string) => {
  try {
    await connectToDatabase();

    const event = await Event.findOne({ slug }).lean();

    // Prevents app crash if event is missing or has no tags
    if (!event || !event.tags) return [];

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();

    // Converts Mongoose ObjectIDs and Date types to plain serializable JSON
    return JSON.parse(JSON.stringify(similarEvents));
  } catch (e) {
    return [];
  }
};