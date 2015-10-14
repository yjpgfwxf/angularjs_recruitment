#初始化模块
INSERT INTO cfg_module(NAME,url,parent_id,sort_index,TYPE)VALUES('系统管理','',0,1,2);
SET @module_id=(SELECT LAST_INSERT_ID());
INSERT INTO cfg_module(NAME,url,parent_id,sort_index,TYPE)VALUES('组管理','groups.html',@module_id,1,2);
INSERT INTO cfg_module(NAME,url,parent_id,sort_index,TYPE)VALUES('用户管理','users.html',@module_id,2,2);
INSERT INTO cfg_module(NAME,url,parent_id,sort_index,TYPE)VALUES('权限管理','actions.html',@module_id,3,2);
#初始化action
INSERT INTO cfg_action(module_id,action_name,alias,sort_index)VALUES(2,'添加','add',1),(2,'删除','delete',1),(2,'修改','edit',1);


#初始化超级管理员
INSERT INTO core_customer(NAME,industry_id,address,type_id,region_id,STATUS)VALUES('超级管理员',1,'软通动力',1,110108,1);
SET @customer_id=(SELECT LAST_INSERT_ID());
INSERT INTO core_system(NAME,domain,customer_id,STATUS,create_user_id,TYPE)VALUES('管理系统','admin',@customer_id,1,0,1);
SET @system_id=(SELECT LAST_INSERT_ID());
INSERT INTO core_user(user_name,PASSWORD,STATUS,create_user_id,system_id)
VALUES('superadmin','ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413',1,0,@system_id);
SET @user_id=(SELECT LAST_INSERT_ID());

#初始化系统模块关系
INSERT INTO core_system_style_module(system_id,module_id,style_id,template_id,module_show_name)VALUES(@system_id,1,1,1,'系统管理'),(@system_id,2,1,1,'角色管理'),(@system_id,3,1,1,'用户管理'),(@system_id,4,1,1,'权限管理');

#初始化组
INSERT INTO core_group(NAME,parent_id,creata_user_id,system_id)VALUES('超级管理员',0,@user_id,@system_id);
SET @group_id=(SELECT LAST_INSERT_ID());

INSERT INTO core_group_module(group_id,module_id,system_id,action_id,action_show_name)VALUES(@group_id,2,@system_id,1,'添加');

#初始化用户和组的关系
INSERT INTO core_user_group(system_id,user_id,group_id)VALUES(@system_id,@user_id,@group_id);

#初始化用户action

TRUNCATE core_customer;
TRUNCATE core_system;
TRUNCATE core_user;
TRUNCATE core_system_style_module;
TRUNCATE core_group;
TRUNCATE core_group_module;
TRUNCATE core_user_group;