
export const getMessagesByGroupIdValidationSchema = [
  param("groupId").isMongoId().withMessage("groupId is required"),
];
