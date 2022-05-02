const route =require("express").Router();
const UserCtrl = require("../controller/UserCtrl");
const userMiddleware = require("../middleware/user");



route.post(`/register`,UserCtrl.register);
route.post(`/login`,UserCtrl.login);
route.put(`/update/:id`,UserCtrl.updateProfile);
route.get(`/userInfo`,userMiddleware, UserCtrl.getUser);
route.get(`/refreshToken`,UserCtrl.refreshToken);
route.put(`/:id/search`,UserCtrl.searchFriend);
route.put(`/:id/accept`,UserCtrl.acceptRequest);
route.put(`/:id/decline`,UserCtrl.declineRequest);
route.get(`/logout`,UserCtrl.logout);



module.exports = route