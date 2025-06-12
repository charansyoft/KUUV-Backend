import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { initSocket } from "./socket/socket.js";
// import { Server } from "socket.io";
import { connect } from "./db/index.js";
import { validateRequest } from "./helpers/validateRequest.js";
import { default as verifyToken } from "./helpers/verifyToken.js";
import forgotPassword from "./routes/auth/forgotPassword.js";
import { forgotPasswordValidationSchema } from "./routes/auth/forgotPasswordValidationSchema.js";
import login from "./routes/auth/login.js";
import { loginValidationSchema } from "./routes/auth/loginValidationSchema.js";
import resetPassword from "./routes/auth/resetPassword.js";
import { resetPasswordValidationSchema } from "./routes/auth/resetPasswordValidationSchema.js";
import verifyOtp from "./routes/auth/verifyOtp.js";
import { verifyOtpValidationSchema } from "./routes/auth/verifyOtpValidationSchema.js";
import createCategory from "./routes/categories/createCategory.js";
import { createCategoryValidationSchema } from "./routes/categories/createCategoryValidationSchema.js";
import getCategories from "./routes/categories/getCategories.js";
import getCategoryById from "./routes/categories/getCategoryById.js";
import { getCategoryByIdValidationSchema } from "./routes/categories/getCategoryByIdValidationSchema.js";
import { toggleCheckStatus } from "./routes/groups/toggleCheckStatus.js";
import toggleGroupJoin from "./routes/groups/toggleGroupJoin.js";
import { toggleGroupJoinValidation } from "./routes/groups/toggleGroupJoinValidationSchema.js";
import createLocation from "./routes/locations/createLocation.js";
import { createLocationValidationSchema } from "./routes/locations/createLocationValidationSchema.js";
import getLocationById from "./routes/locations/getLocationById.js";
import { getLocationByIdValidationSchema } from "./routes/locations/getLocationByIdValidationSchema.js";
import getLocations from "./routes/locations/getLocations.js";
import { getLocationsValidationSchema } from "./routes/locations/getLocationsValidationSchema.js";
import updateLocation from "./routes/locations/updateLocation.js";
import { updateLocationValidationSchema } from "./routes/locations/updateLocationValidationSchema.js";
import getCountries from "./routes/misc/getCountries.js";
import validateOtp from "./routes/misc/validateOtp.js";
import { validateOtpValidationSchema } from "./routes/misc/validateOtpValidationSchema.js";
import createEndUser from "./routes/users/createEndUser.js";
import { createEndUserValidationSchema } from "./routes/users/createEndUserValidationSchema.js";
import deleteEndUser from "./routes/users/deleteEndUser.js";
import getUserById from "./routes/users/getUserById.js";
import { getUserByIdValidationSchema } from "./routes/users/getUserByIdValidationSchema.js";
import getUserProfile from "./routes/users/getUserProfile.js";
import getUsers from "./routes/users/getUsers.js";
import reportEndUser from "./routes/users/reportEndUser.js";
import { reportEndUserValidationSchema } from "./routes/users/reportEndUserValidationSchema.js";
import { updateUserProfile } from "./routes/users/updateUserProfile.js";
// import updateUserProfileValidationSchema from "./routes/users/updateUserProfileValidationSchema.js";
// import toggleCheckStatusValidationSchema from './routes/groups/toggleCheckStatusValidationSchema.js';
import { getJoinedGroupsByPhone } from "./routes/groups/JoinedGroups.js";
import createPost from "./routes/posts/createPost.js";
import createPostValidationSchema from "./routes/posts/createPostValidationSchema.js";
import getPosts from "./routes/posts/GetUserPosts.js";
import { getPostsValidationSchema } from "./routes/posts/getPostsValidationSchema.js";
import likePost from "./routes/posts/likePost.js";
import { likePostValidationSchema } from "./routes/posts/likePostValidationSchema.js";
import updatePost from "./routes/posts/updatePost.js";
import { updatePostValidationSchema } from "./routes/posts/updatePostValidationSchema.js";
import GetGroupsByPhoneValidationSchema from "./routes/groups/GetGroupsByPhoneValidationSchema.js";
import GetGroupsByPhone from "./routes/groups/GetGroupsByPhone.js";
import { getGroupDetailsByGroupIdValidationSchema } from "./routes/groups/getGroupDetailsByGroupIdValidationSchema.js";
import getGroupDetails from "./routes/groups/getGroupDetails.js";
import { createChatValidationSchema } from "./routes/chats/CreateChatValidationSchema.js";
import { getChatsValidationSchema } from "./routes/chats/getChatsValidationSchema.js";
import { getChats } from "./routes/chats/getChats.js";
import { sendMessageValidationSchema } from "./routes/chats/sendMessageValidationSchema.js";
import sendMessage from "./routes/chats/sendMessage.js";
import { getMessagesValidationSchema } from "./routes/chats/getMessagesValidationSchema.js";
import getMessages from "./routes/chats/getMessages.js";
import getChatById from "./routes/chats/getChatById.js";
import { getChatByIdValidationSchema } from "./routes/chats/getChatByIdValidationSchema.js";
import { sendGroupMessagesValidationSchema } from "./routes/groups/sendGroupMessagesValidationSchema.js";
import sendGroupMessages from "./routes/groups/sendGroupMessage.js";
import getGroupMessages from "./routes/groups/getGroupMessages.js";
import { getGroupMessagesValidationSchema } from "./routes/groups/getGroupMessagesValidationSchema.js";
import MessageSeenValidationSchema from "./routes/chats/MessageSeenValidationSchema.js";
import MessageSeen from "./routes/chats/MessageSeen.js";
// import { joinedGroupsValidationSchema } from './routes/groups/JoinedGroupsValidationSchema.js';
// import { upload } from "./helpers/upload.js";
import postController from "./postController.js"
import { expressInterest } from "./routes/groups/expressInterest.js";
import multer from "multer";
import GetUserPosts from "./routes/posts/GetUserPosts.js";
import groupToPersonalChatID from "./routes/groups/GroupToPersonalChatId.js";
import { leaveGroupValidation } from "./routes/groups/leaveGroupValidation.js";
import { leaveGroup } from "./routes/groups/leaveGroup.js";
import { Notifications } from "./routes/Notifications/Notification.js";
import { createChat } from "./routes/chats/createChat.js";

const app = express();
const PORT = 3000;
// Configure multer to save uploads
const upload = multer({ dest: 'uploads/' });
app.use('/uploads', express.static('uploads')); // To serve uploaded images if needed

dotenv.config();
connect(); // MongoDB connection
app.use(express.json());
app.use(cors());

// Misc Routes
app.get('/misc/countries', getCountries); // prettier-ignore
app.post('/misc/validateotp', validateOtpValidationSchema, validateOtp); // prettier-ignore

// Auth Routes
app.post('/auth/login', (req, res) => {
  console.log("✅ Request Received:", req.body);
  res.json({ message: "Login request hit the backend!", data: req.body });
});
app.post('/auth/verify', verifyOtpValidationSchema, validateRequest, verifyOtp); //prettier-ignore
app.post('/auth/forgotpassword', forgotPasswordValidationSchema, forgotPassword); // prettier-ignore
app.post('/auth/resetpassword', resetPasswordValidationSchema, resetPassword); // prettier-ignore

// User Routes
app.post('/users/enduser', createEndUserValidationSchema, validateRequest, createEndUser); // prettier-ignore
app.get('/users/profile', verifyToken, getUserProfile); // prettier-ignore
app.patch("/profile" , verifyToken,updateUserProfile); //prettier-ignore
app.get('/users/:userId', verifyToken, getUserByIdValidationSchema, validateRequest, getUserById); // prettier-ignore
app.delete('/users/:userId', verifyToken, deleteEndUser); // prettier-ignore
app.get('/users', verifyToken, getUsers); // prettier-ignore
app.post('/users/report', verifyToken, reportEndUserValidationSchema, validateRequest, reportEndUser); // prettier-ignore
app.get('/GetUserPosts', verifyToken, getPostsValidationSchema, validateRequest, GetUserPosts); //prettier-ignore

// Category Routes
app.post('/categories', verifyToken, createCategoryValidationSchema, validateRequest, createCategory); // prettier-ignore
app.get('/categories', verifyToken, getCategories); // prettier-ignore
app.get('/categories/:categoryId', verifyToken, getCategoryByIdValidationSchema, validateRequest, getCategoryById); // prettier-ignore

// Location Routes
app.post('/locations', verifyToken, createLocationValidationSchema, validateRequest, createLocation); // prettier-ignore
app.get('/locations', verifyToken, getLocationsValidationSchema, validateRequest, getLocations); //prettier-ignore
app.get('/locations/:locationId', verifyToken, getLocationByIdValidationSchema, validateRequest, getLocationById); // prettier-ignore
app.patch('/locations/:locationId', verifyToken, updateLocationValidationSchema, validateRequest, updateLocation); // prettier-ignore

// GROUPS Routes
app.post("/groups/join", verifyToken, toggleGroupJoinValidation, toggleGroupJoin); //prettier-ignore
// app.post('/groups/checkStatus', verifyToken, toggleCheckStatus); //prettier-ignore
app.post('/api/groups/joinedGroupsByPhone', getJoinedGroupsByPhone); //prettier-ignore
app.post("/GetGroupsByPhone", verifyToken,GetGroupsByPhoneValidationSchema, validateRequest, GetGroupsByPhone); //prettier-ignore
app.post("/groups/:GroupId", verifyToken, getGroupDetailsByGroupIdValidationSchema, validateRequest, getGroupDetails); //prettier-ignore
app.get("/groups/:groupId/messages", verifyToken, getGroupMessagesValidationSchema, validateRequest, getGroupMessages); //prettier-ignore
app.post("/groups/:groupId/messages",verifyToken, sendGroupMessagesValidationSchema, validateRequest, sendGroupMessages ); //prettier-ignore
app.post("/PostInGroupChats", verifyToken, postController)
app.post("/GroupPostExpressInterest", verifyToken, expressInterest, );
app.post("/GroupToPersonalChatID", verifyToken, groupToPersonalChatID)
app.post("/LeaveGroup", verifyToken, leaveGroupValidation, leaveGroup )

// CHATS Routes
app.post("/chats", verifyToken, validateRequest, createChat ); //prettier-ignore
app.get("/chats", verifyToken, getChatsValidationSchema, validateRequest, getChats); //prettier-ignore
app.get("/chats/:chatId", verifyToken, getChatByIdValidationSchema(), validateRequest, getChatById); //prettier-ignore
app.post("/chats/:chatId/messages", verifyToken, sendMessageValidationSchema, validateRequest, sendMessage); //prettier-ignore
app.get("/chats/:chatId/messages", verifyToken, getMessagesValidationSchema, validateRequest, getMessages); //prettier-ignore
app.patch("/chats/:chatId/MessageSeen", verifyToken, MessageSeenValidationSchema, validateRequest, MessageSeen); //prettier-ignore

// Notification & Shouts
app.get("/notifications", verifyToken, Notifications);
app.get('/', (req, res) => {
  res.send('Server is worksadasdasding ✅');
  console.log("CALL FROM FRONT-END !!!")
});


const Server = http.createServer(app);

initSocket(Server);

Server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

