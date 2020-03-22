<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >删除</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="addSelection"
                >添加</el-button>
                <el-select v-model="query.roleId" placeholder="角色" class="handle-select mr10">
                    <el-option key="1" label="超级管理员" value=1></el-option>
                    <el-option key="2" label="管理员" value=2></el-option>
                    <el-option key="3" label="普通用户" value=3></el-option>
                </el-select>
                <el-input v-model="query.username" placeholder="请输入用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="orderNo" label="订单号" align="center"></el-table-column>
                <el-table-column label="订单商品详情" align="center">
                    <template slot-scope="scope">
                        <el-tag @click="findOrderShop(scope.row.orderList)">点击查看</el-tag> 
                    </template>
                </el-table-column>
                <el-table-column prop="allPoint" label="合计积分" align="center"></el-table-column>
                 <el-table-column prop="receive.receiver" label="收货人" align="center"></el-table-column>
                  <el-table-column prop="receive.phone" label="联系电话" align="center"></el-table-column>
                   <el-table-column label="地址" align="center">
                       <template slot-scope="scope">
                           {{scope.row.receive.area}}{{scope.row.receive.detailAddress}}
                       </template>
                   </el-table-column>
                <el-table-column prop="creatTime" label="下单时间" align="center"></el-table-column>
                <el-table-column prop="payTime" label="支付时间" align="center"></el-table-column>
                <el-table-column prop="sendTime" label="发货时间" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center"></el-table-column>
                <!-- <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"
                        >{{scope.row.state}}</el-tag>
                    </template>
                </el-table-column> -->

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope" v-if="scope.row.status!='待收货'">
                        <el-button type="danger" @click="send(scope.$index, scope.row)">发货</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 查看弹出框 -->
        <el-dialog title="订单商品详情" :visible.sync="shopVisible">
             <el-table
                :data="orderShop"
                border
                class="table"
                style="width: 100%">
                <el-table-column
                prop="shopName"
                label="名称"
                width="180">
                </el-table-column>
                <el-table-column
                label="图片"
                width="180">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="imgBaseUrl+scope.row.shopImg"
                            :preview-src-list="[scope.row.shopImg]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                prop="point"
                label="积分"
                width="180">
                </el-table-column>
                <el-table-column
                prop="num"
                label="数量">
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="修改" :visible.sync="editVisible" width="30%">
            <el-form ref="form2" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="updateUserName"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="updatePassword"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="updateEmail"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="updateRoleId" class="handle-select mr10">
                        <el-option key="1" label="普通用户" value=3></el-option>
                        <el-option key="2" label="管理员" value=2></el-option>
                        <el-option key="3" label="超级管理员" value=1></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload
                        class="avatar-uploader uploader-headimg"
                        action="/api/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imgBaseUrl+updateHeadImg" :src="imgBaseUrl+updateHeadImg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加弹出框 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="addUser" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="addUser.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="addUser.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="addUser.email"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="addUser.roleId" class="handle-select mr10">
                        <el-option key="1" label="普通用户" value=3></el-option>
                        <el-option key="2" label="管理员" value=2></el-option>
                        <el-option key="3" label="超级管理员" value=1></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload
                        class="avatar-uploader uploader-headimg"
                        action="/api/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imgShow" :src="imgShow" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData, deleteUser } from '../../api/index';
import imgUrl from '../../api/imgUrl';
export default {
    name: 'basetable',
    data() {
        return {
            shopVisible:false, //查看订单商品弹框
            orderShop: [],  //订单商品
            query: {
                username: '',
                pageIndex: 1,
                pageSize: 5,
                roleId:''
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 5,
            updateUser: {}, //修改用户
            addUser: {
                roleId: '3'
            }, // 添加用户
            idx: -1,
            id: -1,
            imgBaseUrl:'',//图片基本路径localhost:5000/public
            imgShow: '',//上传图片显示,
            // 编辑
            updateUserName:'',
            updatePassword:'',
            updateEmail:'',
            updateRoleId:'',
            updateHeadImg:'', 
            updateId:'',
            updateHeadImgFlag:1 //用户判断是否修改时上传图片
        };
    },
    created() {
        this.getData();
    },
    methods: {
        findOrderShop (orderShop) {
            this.shopVisible = true
            this.orderShop = orderShop
        },
        // 获取订单信息
        getData() {
            this.imgBaseUrl= imgUrl;
            this.$http.post('/api/findOrder')
            .then(res => {
                if(res.status == 200){
                    this.tableData = res.data
                    this.tableData.forEach((item,index)=>{
                        var create = new Date(item.creatTime);
                        var creatTime = create.getFullYear() + '-' + (create.getMonth()+1) + '-' + create.getDate() + ' ' +create.getHours() +':' + create.getMinutes()+':' + create.getSeconds();
                        item.creatTime = creatTime
                        if(item.payTime){
                            var pay = new Date(item.payTime);
                            var payTime = pay.getFullYear() + '-' + (pay.getMonth()+1) + '-' + pay.getDate() + ' ' +pay.getHours() +':' + pay.getMinutes()+':' + pay.getSeconds();
                            item.payTime = payTime
                        }
                        if(item.sendTime){
                            var send = new Date(item.sendTime);
                            var sendTime = send.getFullYear() + '-' + (send.getMonth()+1) + '-' + send.getDate() + ' ' +send.getHours() +':' + send.getMinutes()+':' + send.getSeconds();
                            item.sendTime = sendTime
                        }
                        var countPoint = 0
                        item.orderList.forEach(pro=>{                          
                            countPoint = countPoint + pro.num*pro.point
                        })
                        item.allPoint = countPoint
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })


            // this.$http.post('/api/user/findUser',{
            //     username: '',
            //     pageIndex: 0,
            //     pageSize: 0,
            //     roleId:''
            // })
            // .then(res=>{
            //     if(res.status==200){
            //         this.pageTotal=res.data.length;
            //     } 
            // })
            // .catch(error=>{
            //     console.log(error)
            // })
            // this.pageInfo();
        },
        // 根据分页信息和用户名称查询用户
        pageInfo(){
            this.$http.post('/api/user/findUser',this.query)
            .then(res=>{
                if(res.status==200){
                    this.tableData = res.data;
                    this.tableData.forEach((item,index)=>{
                        if(this.tableData[index].roleId==1){
                            this.tableData[index].roleName='超级管理员'
                        }
                        if(this.tableData[index].roleId==2){
                            this.tableData[index].roleName='管理员'
                        }
                        if(this.tableData[index].roleId==3){
                            this.tableData[index].roleName='普通用户'
                        }
                    })
                }
            })
            .catch(error=>{
                console.log(error)
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            console.log(this.query)
            this.$http.post('/api/user/findUser',{
                username: this.query.username,
                pageIndex: 0,
                pageSize: 0,
                roleId:this.query.roleId
            })
            .then(res=>{
                if(res.status==200){
                    this.pageTotal=res.data.length;
                }
            })
            .catch(error=>{
                console.log(error)
            })
            this.pageInfo();
        },
        // 发货操作
        send(index, row) {
            var id = row._id;
            this.$confirm('确定要发货吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.$http.post('/api/updateOrderBySend',{
                    status:'待收货',
                    orderNo:row.orderNo,
                    sendTime:new Date()
                })
                .then(res=>{
                    if(res.data.msg==1){
                        this.getData();
                        this.$message.success('发货成功');
                    }
                })
            })
            .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let ids = [];
            for (let i = 0; i < length; i++) {
                ids.push(this.multipleSelection[i]._id);
            }
            if(length==0){
                this.$message({
                    message: '请选择要删除的数据',
                    type: 'warning'
                });
            }else{
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    this.$http.post('/api/user/deleteManyUser',{
                        ids:ids
                    })
                    .then(res=>{
                        if(res.status==200){
                            // console.log('成功')
                            // this.getData();
                            this.query.username='',
                            this.query.roleId='',
                            this.query.pageIndex=1,
                            this.getData();
                            this.$message.success('删除成功');
                        }
                    })
                    .catch(error=>{
                        console.log(error)
                    })
                })
                .catch(() => {});
            }
            this.multipleSelection = [];
        },
        // 修改操作
        handleEdit(index, row) {
            this.idx = index;
            // this.updateUser = row; //错，编辑框和表格会同步变化
            this.updateId = row._id;
            this.updateUserName = row.username;
            this.updatePassword = row.password;
            this.updateEmail = row.email;
            this.updateRoleId = row.roleId;
            this.updateHeadImg = row.headImg;
            this.updateHeadImgFlag = 1;
            this.editVisible = true;
        },
        // 保存修改
        saveEdit() {
            this.updateHeadImgFlag = 0;
            this.updateUser={
                _id:this.updateId,
                username:this.updateUserName,
                password:this.updatePassword,
                email:this.updateEmail,
                roleId:this.updateRoleId,
                headImg:this.updateHeadImg
            }
            if(this.updateRoleId==1){
                this.updateUser.roleName="超级管理员"
            }
            if(this.updateRoleId==2){
                this.updateUser.roleName="管理员"
            }
            if(this.updateRoleId==3){
                this.updateUser.roleName="普通用户"
            }
            this.editVisible = false;

            this.$http.post('/api/user/updateUser',this.updateUser)
            .then(res=>{
                if(res.status==200){
                    this.$message.success(`修改成功`);
                    this.$set(this.tableData, this.idx, this.updateUser);
                }
            })
            .catch(error=>{
                console.log(error)
            })
            
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.pageInfo();
        },
        // 添加
        addSelection(){
            this.addVisible = true;
        },
        // 保存添加
        saveAdd(){
            this.addVisible = false;
            // 设置默认图片
            if(this.addUser.imageUrl==undefined){
                this.addUser.imageUrl = '/avatar/head.png';
            }
            this.$http.post('/api/user/addUser',{
                username: this.addUser.username,
                password: this.addUser.password,
                email: this.addUser.email,
                roleId: parseInt(this.addUser.roleId),
                headImg: this.addUser.imageUrl
            }).then(res=>{
                if(res.status==200){
                    this.query.username='';
                    this.query.roleId='';
                    this.query.pageIndex=1,
                    this.getData();
                    this.$message.success(`添加成功`);
                    // this.getData().then(()=>{
                    //     console.log(0)
                    //     this.$message.success('添加成功');
                    // })
                    // var promise = new Promise(this.getData());
                    // promise.then(()=>{
                    //     this.$message.success('添加成功');
                    // })
                }
            }).catch(error=>{
                console.log(error)
            })
        },
        handleAvatarSuccess(res, file) {
            // console.log(file)
            this.addUser.imageUrl = URL.createObjectURL(file.raw);
            console.log(URL.createObjectURL(file.raw))
            if (res.status === '0') {
                this.$message.success(res.msg)
                this.addUser.imageUrl = res.result.data
            } else {
                this.$message.error(res.msg)
            }
            this.imgShow = this.imgBaseUrl+ this.addUser.imageUrl;
            if(this.updateHeadImgFlag==1){
                this.updateHeadImg = this.addUser.imageUrl;
                console.log(this.updateHeadImg)
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
};
</script>

<style scoped>
.handle-box {
margin-bottom: 20px;
}

.handle-select {
width: 120px;
}

.handle-input {
width: 300px;
display: inline-block;
}
.table {
width: 100%;
font-size: 14px;
}
.red {
color: #ff0000;
}
.mr10 {
margin-right: 10px;
}
.table-td-thumb {
display: block;
margin: auto;
width: 40px;
height: 40px;
}

/* 头像 */
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<style>
    .uploader-headimg .el-upload--text{
      width: 180px;
    }
</style>
