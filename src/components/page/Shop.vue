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
                <!-- <el-select v-model="query.roleId" placeholder="角色" class="handle-select mr10">
                    <el-option key="1" label="超级管理员" value=1></el-option>
                    <el-option key="2" label="管理员" value=2></el-option>
                    <el-option key="3" label="普通用户" value=3></el-option>
                </el-select> -->
                <el-input v-model="query.username" placeholder="请输入商品名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="shopList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column> -->
                <el-table-column prop="shopName" label="商品名称"></el-table-column>
                <el-table-column label="商品类型" prop="shopType">
                    <!-- <template slot-scope="scope">{{scope.row.money}}{{scope.row.password}}</template> -->
                </el-table-column>
                <el-table-column prop="point" label="兑换积分" width="100" align="center"></el-table-column>
                <el-table-column prop="money" label="价格" width="100"></el-table-column>
                <!-- <el-table-column prop="email" label="颜色">
                    <template slot-scope="scope">
                        <template v-for="(item,index) in scope.row.colorParams">
                            {{item.color}}
                            <el-image
                                class="table-td-thumb"
                                :src="imgBaseUrl+item.pic"
                                :preview-src-list="[imgBaseUrl+item.pic]"
                                :key="index"
                            ></el-image>
                        </template>
                    </template>
                </el-table-column> -->
                <el-table-column prop="stock" label="库存"></el-table-column>
                <el-table-column label="商品主图片" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="imgBaseUrl+scope.row.shopImg"
                            :preview-src-list="[scope.row.shopImg]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="商品详情图" align="center">
                    <template slot-scope="scope">
                        <template v-for="(item,index) in scope.row.pics">
                            <el-image
                                class="table-td-thumb"
                                :src="imgBaseUrl+item"
                                :preview-src-list="[imgBaseUrl+item]"
                                :key="index"
                            ></el-image>
                        </template>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"
                        >{{scope.row.state}}</el-tag>
                    </template>
                </el-table-column> -->

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >修改</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
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
            <el-form ref="form" :model="addShop" label-width="70px">
                <el-form-item label="商品名称">
                    <el-input v-model="addShop.shopName"></el-input>
                </el-form-item>
                <el-form-item label="商品类型">
                    <el-select v-model="addShop.typeId" class="handle-select mr10">
                        <template v-for="(item,index) in shopTypeList">
                            <el-option  :key="index+1" :label="item.shopType" :value="item._id"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="兑换积分">
                    <el-input v-model="addShop.point"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="addShop.money"></el-input>
                </el-form-item>
                <el-form-item label="库存">
                    <el-input v-model="addShop.stock"></el-input>
                </el-form-item>
                <el-form-item label="商品主图">
                    <el-upload
                        class="avatar-uploader uploader-shopimg"
                        action="/api/uploadShop"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imgShow" :src="imgShow" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="颜色">
                    <el-input v-model="addUser.password" class="color-input"></el-input>
                    <!-- <input type="text"> -->
                    <el-upload
                        class="avatar-uploader uploader-colorimg"
                        action="/api/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imgShow" :src="imgShow" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <!-- <button>继续添加</button> -->
                </el-form-item>
                <el-form-item label="商品详图">
                    <el-upload
                    action="/api/uploadShop"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="handleShopDetailSuccess"
                    class="upload-pic">
                    <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
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
            shopList:[], //商品列表
            shopTypeList:[], //商品类型
            addShop:{}, //添加商品
            dialogImageUrl: '', //商品详图展示
            shopDetailImg:[], //商品详图存进数据库数据
            dialogVisible: false,
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
        // 获取 easy-mock 的模拟数据
        getData() {
            // fetchData(this.query).then(res => {
            //     console.log(111)
            //     console.log(res);
            //     this.tableData = res.list;
            //     this.pageTotal = res.pageTotal || 50;
            // });
            // fetchData().then(res => {
            //     console.log(111)
            //     console.log(res);
            //     // this.tableData = res.list;
            //     // this.pageTotal = res.pageTotal || 50;
            // });
            this.imgBaseUrl= imgUrl;
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

            // 商品列表
            // this.$http.get('/api/findShopList')
            // .then(res => {
            //     this.shopList = res.data
            //     console.log(res)
            // })
            // .catch(error => {
            //     console.log(error)
            // })
            this.$http.get('/api/findShopList2')
            .then(res => {
                var shop = []
                res.data.forEach(item=>{
                    item.shopDetails.forEach((item2,index)=>{
                        item2.shopType = item.shopType
                        shop.push(item2)
                    })
                })
                this.shopList = shop
            })
            .catch(error => {
                console.log(error)
            })
            // 商品类型
            this.$nextTick(() => {
                this.$http.get('/api/findShopType')
                .then(res => {
                    this.shopTypeList = res.data
                })
                .catch(error => {
                    console.log(error)
                })
            });
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
        // 删除操作
        handleDelete(index, row) {
            var id = row._id;
            // deleteUser(id).then(res => {
            //     console.log(111)
            //     console.log(res);
            //     // this.tableData = res.list;
            //     // this.pageTotal = res.pageTotal || 50;
            // });
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.$http.post('/api/user/deleteUser',{
                    id:row._id
                })
                .then(res=>{
                    if(res.data.msg==1){
                        // this.tableData.splice(index, 1);
                        this.query.username='',
                        this.query.roleId='',
                        this.query.pageIndex=1,
                        this.getData();
                        this.$message.success('删除成功');
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
                id:this.updateId,
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
            // if(this.addUser.imageUrl==undefined){
            //     this.addUser.imageUrl = '/avatar/head.png';
            // }
            // this.$http.post('/api/user/addUser',{
            //     username: this.addUser.username,
            //     password: this.addUser.password,
            //     email: this.addUser.email,
            //     roleId: parseInt(this.addUser.roleId),
            //     headImg: this.addUser.imageUrl
            // }).then(res=>{
            //     if(res.status==200){
            //         this.query.username='';
            //         this.query.roleId='';
            //         this.query.pageIndex=1,
            //         this.getData();
            //         this.$message.success(`添加成功`);
            //         // this.getData().then(()=>{
            //         //     console.log(0)
            //         //     this.$message.success('添加成功');
            //         // })
            //         // var promise = new Promise(this.getData());
            //         // promise.then(()=>{
            //         //     this.$message.success('添加成功');
            //         // })
            //     }
            // }).catch(error=>{
            //     console.log(error)
            // })
            // 添加商品
            console.log(this.addShop)
            this.$http.post('/api/addShop',this.addShop)
            .then(res => {
                console.log(res)
                if(res.status == 200){
                    this.getData()
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        // 商品主图片上传
        handleAvatarSuccess(res, file) {
            this.addUser.imageUrl = URL.createObjectURL(file.raw);
            if (res.status === '0') {
                this.$message.success(res.msg)
                this.addShop.shopImg = res.result.data
            } else {
                this.$message.error(res.msg)
            }
            this.imgShow = this.imgBaseUrl+ this.addShop.shopImg;
           
           if(this.updateHeadImgFlag==1){
                this.updateHeadImg = this.addUser.imageUrl;
                console.log(this.updateHeadImg)
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 商品详图
        handleRemove(file, fileList) {
            this.shopDetailImg = [];
            fileList.forEach((item,index)=>{
                 this.shopDetailImg.push(item.response.result.data)
            })
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 商品详图上传成功后
        handleShopDetailSuccess(res, file, fileList){
            this.shopDetailImg = [];
            fileList.forEach((item,index)=>{
                 this.shopDetailImg.push(item.response.result.data)
            })
            this.addShop.pics = this.shopDetailImg
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
    .uploader-shopimg .el-upload--text{
      width: 130px;
    }
    .uploader-shopimg .el-upload--text{
      height: 130px;
    }
    .uploader-shopimg .avatar-uploader-icon{
        width: 130px;
        height: 130px;
        line-height: 130px;
    }
    .upload-pic .el-upload--picture-card{
        width: 80px;
        height: 80px;
        line-height: 80px;
    }
    .upload-pic .el-upload-list--picture-card .el-upload-list__item{
        width: 80px;
        height: 80px;
    }
    .upload-pic .el-upload--picture-card i{
        font-size: 20px;
    }
    .uploader-colorimg .el-upload--text{
        width: 32px;
        height: 32px;
    }
    .uploader-colorimg .avatar-uploader-icon{
        width: 32px;
        height: 32px;
        line-height: 32px;
        font-size: 16px;
    }
    .uploader-colorimg{
        display: inline-block;
    }
    .color-input{
        width: 40%;
    }
    .uploader-colorimg{
        height: 32px;
        position: relative;
        top: 10px;
    }
    .uploader-colorimg .avatar{
        width: 32px;
        height: 32px;
    }
</style>
<style scoped>
    
</style>
