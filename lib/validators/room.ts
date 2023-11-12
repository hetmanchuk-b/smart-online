import {z} from "zod";

export const RoomValidator = z.object({
  title: z.string().min(1, {
    message: "Room title is required."
  }).max(60, {
    message: "Room title must not exceed 60 characters."
  }),
  isPrivate: z.boolean()
});

export const TeamValidator = z.object({
  name: z.string().min(1, {
    message: "Team name is required."
  }).max(40, {
    message: "Team name must not exceed 40 characters."
  }),
  score: z.number()
});
