#初始化脚本
TRUNCATE TABLE core_system;
TRUNCATE TABLE core_system_db;
TRUNCATE TABLE core_user;
#注册系统
SET @NAME='舆情运维系统';
SET @alias='iSentiment';
SET @domain='iSentiment';
SET @system_name='软通舆情运维系统';
SET @last_modified=NOW();
INSERT INTO core_system(NAME,alias,domain,system_name,last_modified)VALUES(@NAME,@alias,@domain,@system_name,@last_modified);
#注册数据配置
SET @system_id=(SELECT LAST_INSERT_ID());
SET @ip='115.28.205.176';
SET @db='digital_marketing_business';
SET @USER='root';
SET @pwd='Pass@word1';
SET @connectionLimit=100;
INSERT INTO core_system_db(`host`,`database`,`user`,`password`,connectionLimit,system_id)VALUES(@ip,@db,@USER,@pwd,@connectionLimit,@system_id);
#注册用户
SET @user_name='admin';
SET @pwd='ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413';#123456
SET @title='超级管理员';
SET @last_modified=NOW();
SET @create_by=1;
INSERT INTO core_user(system_id,user_name,PASSWORD,title,last_modified,create_by)VALUES(@system_id,@user_name,@pwd,@title,@last_modified,@create_by);


