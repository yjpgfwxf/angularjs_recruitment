

SELECT *FROM core_system system INNER JOIN core_user USER ON system.id=user.system_id
/*
1.验证系统是否启用
2.验证用户是否启用
3.验证用户名是否存在
4.验证用户名密码是否正确
*/ 
/*
0;#系统不存在;
1;#系统未启用;
2;#用户不存在;
3;#用户未启用;
4;#用户密码错误;
5;#用户登录成功;
*/
DECLARE system_alias VARCHAR(38);
SET system_alias='isentiment';
DECLARE user_name VARCHAR(38);
SET user_name='admin';
DECLARE pwd VARCHAR(38);
SET pwd='123';

#declare login_status int;
SET @login_status=10;
CALL proc_authenticate_user('isentiment','admin','3627909a29c31381a071ec27f7c9ca97726182aed29a7ddd2e54353322cfb30abb9e3a6df2ac2c20fe23436311d678564d0c8d305930575f60e2d3d048184d79',@login_status);
SELECT @login_status;
#登录
http://127.0.0.1:9999/api/authenticate/login
post
USER-Agent: Fiddler
HOST: 127.0.0.1:9999
Content-LENGTH: 73
Content-TYPE: application/X-www-form-urlencoded; CHARSET=UTF-8
params={"systemAlias":"isentiment","userName":"admin","userPwd":"123456"}
Content-TYPE: application/X-www-form-urlencoded; CHARSET=UTF-8
Cookie: clientToken=408bf288-c969-11e4-9774-4487fc705f0d
#注册系统
params={"systemName":"测试系统","systemAlias":"testsystem","systemDomain":"d1","systemFullName":"测试系统全名","dbIp":"115.28.205.176","dbName":"digital_marketing_business","dbUser":"root","dbPwd":"Pass@word1","dbConnectionLimit":"100","userName":"admin","userPwd":"123456","userTitle":"管理员"}
CALL proc_register_system("测试系统","testsystem13","d4","测试系统全名",'{"connectionLimit":"100","host":"115.28.205.176","user":"root","password":"Pass@word1","database":"digital_marketing_business","multipleStatements":"true"}',"admin","userPwd","userTitle",2)

#更新用户
CALL proc_update_user(2,8,'233','ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413','管理员1','notes',1,1);   

UPDATE core_user SET last_modified=NOW(), user_name='2333',PASSWORD='123456', title='管理员1', STATUS=1, notes='notes' WHERE system_id=1 AND id=2
#验证tokoe
CALL proc_authenticate_token('aa084f7c-cc89-11e4-9774-4487fc705f0d',);


SELECT * FROM core_system_user_token WHERE current_token='aa084f7c-cc89-11e4-9774-4487fc705f0d'
CALL proc_system_database('');
SELECT *FROM core_system_database AS systemDb WHERE systemDb.system_status=1
#查询系统
CALL proc_get_system('','','','','','','2015-03-13','2015-03-17');
