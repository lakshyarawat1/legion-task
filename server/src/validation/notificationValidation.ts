import { query, param } from "express-validator";

export const getNotificationsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50")
    .toInt(),
  query("unreadOnly")
    .optional()
    .isBoolean()
    .withMessage("unreadOnly must be a boolean")
    .toBoolean(),
];

export const notificationIdValidation = [
  param("notificationId")
    .isUUID()
    .withMessage("Invalid notification ID format"),
];
