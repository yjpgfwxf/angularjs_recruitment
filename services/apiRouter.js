/**
 * 应用api router
 */
var express = require('express');
var router = express.Router();
var routerManage = require('./controller/route.js')
var config = require("../config/baseConfig.js");
var authenticate = require('./controller/authenticate.js');
var group=require('./controller/group.js');
var user=require('./controller/user.js');
var modules=require('./controller/modules.js');
var system=require('./controller/system.js');


//动态路由
router.get(/^\/(?!js|style|img|favicon|auto)[a-z|0-9|_|A-Z]*\/{0}$/,routerManage.dynamicDomain);
router.get(/^\/(?!js|style|img|favicon|auto)[a-z|0-9|_|A-Z]*\/{1}$/,routerManage.dynamicDomain);

router.post('/authenticate/login',authenticate.login);
router.get('/authenticate/loginOut',authenticate.loginOut);
router.get('/authenticate/getToken',authenticate.getToken);

router.get('/service/groupInfo',group.getGroupInfo);
router.post('/service/editGroup',group.editGroup);
router.post('/service/deleteGroup',group.deleteGroupInfo);
router.get('/service/groupModuleAction',group.getGroupInfo);
router.post('/service/addGroupAction',group.addGroupPermission);

router.get('/service/queryUser',user.getUserGroup);
router.post('/service/editUser',user.addUser);
router.post('/service/deleteUser',user.deleteUser);
router.get('/service/userModuleAction',user.getUserModuleAction);
router.get('/service/userPermission',user.getUserPermission);
router.post('/service/addUserAction',user.addUserPermission);

router.get('/service/moduleAction',modules.getModuleAction);

router.get('/service/systemInfo',system.getSystemInfo);

module.exports = router;