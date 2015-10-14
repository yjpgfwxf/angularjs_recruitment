(function () {


    var injectParams = ['$scope', '$location',
        'authService', 'commonService', 'rightService', 'modalService'];

    var rightListController = function ($scope, $location, authService, commonService, rightService, modalService) {

        var systemId=0;
        var userId=0;

        //左侧组织机构树
        $scope.org = {
            currentName:"人事",
            currentSelectItem:null,
            currentId:0,
            orgData:[],
            showAdd:function(){
                var modalOptions = {
                    closeButtonText: '取消',
                    actionButtonText: '保存',
                    headerText: '添加角色部门'
                };
                var modalDefaults={
                    templateUrl:commonTools.viewBase+"zpapp/partials/modalGroupAdd.html"
                };
                //保存数据
                modalService.showModal(modalDefaults, modalOptions).then(function (result) {
                    if (result.type === 'ok') {
                        var modalData=result.data;
                        var data={
                            name:modalData.name,
                            parentId:modalData.parentId,
                            state:modalData.state,
                            systemId:systemId,
                            userId:userId
                        };
                        rightService.org.add(data).then(function (result) {
                            if (!result.state) {

                            }
                            else{
                                getOrgData();
                            }
                        },function(error){

                        });
                    }
                });
            },

            delete:function(){
                var data={};
                rightService.org.delete(data).then(function (result) {
                    if (!result.state) {

                    }
                    else{
                        getOrgData();
                    }
                });
            },
            showUpdate:function(data){
                var modalOptions = {
                    closeButtonText: '取消',
                    actionButtonText: '保存',
                    headerText: '编辑角色部门',
                    group:data
                };
                var modalDefaults={
                    templateUrl:commonTools.viewBase+"zpapp/partials/modalGroupAdd.html"
                };
                //保存数据
                modalService.showModal(modalDefaults, modalOptions).then(function (result) {
                    if (result.type === 'ok') {
                        var modalData=result.data;
                        var data={
                            id:modalData.id,
                            name:modalData.name,
                            parentId:modalData.parentId,
                            state:modalData.state,
                            systemId:systemId,
                            userId:userId
                        };
                        rightService.org.update(data).then(function (result) {
                            if (!result.state) {

                            }
                            else{
                                getOrgData();
                            }
                        },function(error){

                        });
                    }
                });
            },
            itemToggle:function(item){
                if($scope.org.currentSelectItem!=null){
                    $scope.org.currentSelectItem.showButton="hideButton";
                    $scope.org.currentSelectItem.selected="";
                }
                if(item.showClass=="display-none"){
                    item.showClass="display-show";
                    item.iconClass="openIcon";
                    item.selected="nodeSelected";
                }
                else{
                    item.showClass="display-none";
                    item.iconClass="closeIcon";
                    item.selected="";
                    //item.showButton="hideButton";
                }
                item.showButton="showButton";
                $scope.org.currentSelectItem=item;
            }
        };

        //右侧用户数据
        $scope.user={
            userData:[],
            showAdd:function(){
                var modalOptions = {
                    closeButtonText: '取消',
                    actionButtonText: '保存',
                    headerText: '添加用户'
                };
                var modalDefaults={
                    templateUrl:commonTools.viewBase+"zpapp/partials/modalUserAdd.html"
                };
                //保存数据
                modalService.showModal(modalDefaults, modalOptions).then(function (result) {
                    if (result.type === 'ok') {
                        var modalData=result.data;
                        var data={
                            id:modalData.id,
                            name:modalData.name,
                            title:modalData.title,
                            phone:modalData.phone,
                            email:modalData.email,
                            state:modalData.state
                        };
                        rightService.user.add(data).then(function (result) {
                            if (!result.state) {

                            }
                            else{
                                getUserData();
                            }
                        },
                            function(err) {

                            }
                        );
                    }
                });
            },
            delete:function(){
                var data={};
                rightService.user.delete(data).then(function (result) {
                    if (!result.state) {

                    }
                    else{
                        getUserData();
                    }
                });
            },
            showUpdate:function(data){
                var modalOptions = {
                    closeButtonText: '取消',
                    actionButtonText: '保存',
                    headerText: '编辑用户',
                    user:data
                };
                var modalDefaults={
                    templateUrl:commonTools.viewBase+"zpapp/partials/modalUserAdd.html"
                };
                //保存数据
                modalService.showModal(modalDefaults, modalOptions).then(function (result) {
                    if (result.type === 'ok') {
                        var modalData=result.data;
                        var data={
                            id:modalData.id,
                            name:modalData.name,
                            title:modalData.title,
                            phone:modalData.phone,
                            email:modalData.email,
                            state:modalData.state
                        };
                        rightService.user.update(data).then(function (result) {
                            if (!result.state) {

                            }
                            else{
                                getUserData();
                            }
                        },function(error){

                        });
                    }
                });
            }
        }

        //搜索
        $scope.searchText = null;

        //分页
        $scope.pages= {
            totalRecords: 1,
            pageSize: 10,
            currentPage: 1,
            //分页事件
            pageChanged: function (page) {
                $scope.pages.currentPage = page;
                getUserData();
            }
        };

        //获取左侧导航数据
        function getOrgData(){
            var params={
                systemId:systemId,
                userId:userId
            };
            rightService.org.getList(params).then(function (result) {
                if (result.state) {
                    var groupsRoot={};
                    var groupsChild={};
                    var indexs=[];
                    for(var i=0;i<result.data.length;i++){
                        var item=result.data[i];
                        if(item.parentId==0){
                            item.showClass="display-none";
                            item.iconClass="closeIcon";
                            item.showButton="hideButton";
                            groupsRoot[item.id]=item;
                            indexs.push(item.id);
                        }
                        else{
                            if(groupsChild[item.parentId]==undefined){
                                groupsChild[item.parentId]=[];
                            }
                            item.showClass="display-none";
                            item.iconClass="closeIcon";
                            item.showButton="hideButton";
                            groupsChild[item.parentId].push(item);
                        }
                    }

                    var orgDatas=[];
                    for(var i=0;i<indexs.length;i++) {
                        var item = groupsRoot[indexs[i]];
                        orgDatas.push(item);
                        setChilds(item);
                    }

                    $scope.org.orgData=orgDatas;

                    function setChilds(rootNode) {
                        if (groupsChild[rootNode.id] != undefined) {
                            rootNode["childs"] = groupsChild[rootNode.id];
                            for (var i = 0; i < rootNode["childs"].length; i++) {
                                var root = rootNode["childs"][i];
                                setChilds(root);
                            }
                        }
                    }
                }
            });
        };

        //获取右侧用户数据
        function getUserData(){
            var params={
                pageNo:$scope.pages.currentPage,
                pageSize:$scope.pages.pageSize,
                searchText:$scope.searchText,
                groupId:$scope.org.currentId,
                systemId:systemId
            };
            rightService.user.getList(params).then(function (result) {
                if (result.state) {
                    $scope.user.userData=result.data;
                }
            });
        }

        //页面加载后，初始化数据
        function init() {
            //验证是否有权限
            var promise = authService.permissionCheck();

            promise.then(function (data) {
                initData();
            }, function (data) {

            });

            function initData(){
                systemId=authService.systemInfo.systemId;
                userId=authService.systemInfo.userId;
                $scope.user.userData.push( {id:'1',name:'name',title:'title',phone:'123',email:'email'});
                getOrgData();
            }
        }
        init();
    };

    rightListController.$inject = injectParams;
    angular.module('zpApp').controller('RightListController', rightListController);
}());
