<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="addSelection"
                >添加</el-button>
                <el-select v-model="typeId" placeholder="商品类型" class="handle-select mr10" @change="findTypeShop">
                    <template v-for="(item,index) in shopTypeList">
                        <el-option  :key="index+1" :label="item.shopType" :value="item._id"></el-option>
                    </template>
                </el-select>
                <div class="search_wrap">
                    <el-input v-model="shopName" placeholder="请输入商品名" class="handle-input mr10"></el-input>
                    <el-button type="primary"  @click="handleSearch">搜索</el-button>
                    <el-button type="primary" @click="reset">重置</el-button>
                </div>
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
                <el-table-column label="商品类型" prop="typeDetails[0].shopType">
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
             <el-form ref="form2"  label-width="70px">
                <el-form-item label="商品名称">
                    <el-input v-model="updateShopName"></el-input>
                </el-form-item>
                <el-form-item label="商品类型">
                    <el-select v-model="updateTypeId" class="handle-select mr10">
                        <template v-for="(item,index) in shopTypeList">
                            <el-option  :key="index+1" :label="item.shopType" :value="item._id"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="兑换积分">
                    <el-input v-model="updatepoint"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="updateMoney"></el-input>
                </el-form-item>
                <el-form-item label="库存">
                    <el-input v-model="updateStock"></el-input>
                </el-form-item>
                <el-form-item label="商品主图">
                    <el-upload
                        class="avatar-uploader uploader-shopimg"
                        action="/api/uploadShop"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess2"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imgBaseUrl+updateshopImg" :src="imgBaseUrl+updateshopImg" class="avatar shopic_main">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品详图">
                    <el-upload
                    action="/api/uploadShop"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove2"
                    :on-success="handleShopDetailSuccess2"
                    :file-list="fileList"
                    class="upload-pic">
                    <i class="el-icon-plus"></i>
                    </el-upload>
                    <!-- <img width="100%" :src="imgBaseUrl+item" alt="" v-for="(item,index) in updatePics" :key="index"> -->
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCancel">取 消</el-button>
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
                <!-- <el-form-item label="颜色">
                    <el-input v-model="addUser.password" class="color-input"></el-input>
                    <input type="text">
                    <el-upload
                        class="avatar-uploader uploader-colorimg"
                        action="/api/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imgShow" :src="imgShow" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <button>继续添加</button>
                </el-form-item> -->
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
            shopDetailImg:[], //添加时商品详图存进数据库数据
            dialogVisible: false,
            query: {
                pageIndex: 1,
                pageSize: 5,
            },
            typeId:'', //商品类型id
            shopName: '', // 商品名称
            tableData: [], //商品列表
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            addUser: {
                roleId: '3'
            }, // 添加用户
            idx: -1,
            id: -1,
            imgBaseUrl:'',//图片基本路径localhost:5000/public
            imgShow: '',//上传图片显示
            fileList:[], //默认商品图片
            // 修改
            updateShopId:'',
            updateShopName:'',
            updateTypeId:'',
            updatepoint:'',
            updateMoney:'',
            updateshopImg:'', 
            updateStock:'',
            updatePics:[],
            updateHeadImgFlag:1 //用户判断是否修改时上传图片
        };
    },
    created() {
        this.imgBaseUrl= imgUrl;
        this.getData();
    },
    methods: {
        getData() {
            // 查询所有商品，拿总数
            this.$http.get('/api/findShopList2')
            .then(res => {
                this.pageTotal = res.data.length
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
            this.pageInfo()
        },
        // 根据分页信息和用户名称查询用户
        pageInfo(){
            this.$http.get('/api/findShopPage',{params:this.query})
            .then(res=>{
                if(res.status==200){
                    this.shopList = res.data
                }
            })
            .catch(error=>{
                console.log(error)
            })
        },
        // 根据商品类型搜索商品
        findTypeShop () {
            // 根据商品类型查询商品，拿总数
            this.$http.post('/api/findShop',{typeId:this.typeId})
            .then(res => {
                this.pageTotal = res.data.length
            })
            .catch(error => {
                console.log(error)
            })
            // 分页查
            this.query = {
                pageIndex: 1,
                pageSize: 5,
                typeId: this.typeId
            }
            this.pageInfo();
        },
        // 触发搜索按钮
        handleSearch() {
            // 根据商品类型查询商品，拿总数
            this.$http.post('/api/searchShop',{shopName:this.shopName})
            .then(res => {
                this.pageTotal = res.data.length
            })
            .catch(error => {
                console.log(error)
            })
            // this.$set(this.query, 'pageIndex', 1);
            this.query = {
                pageIndex: 1,
                pageSize: 5,
                shopName: this.shopName
            }
            this.pageInfo();
        },
        // 重置
        reset () {
            this.query = {
                pageIndex: 1,
                pageSize: 5
            }
            this.getData()
        },
        // 单行删除
        handleDelete(index, row) {
            // var id = row._id;
            console.log(row._id)
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.$http.post('/api/deleteShop',{
                    id:row._id
                })
                .then(res=>{
                    if(res.data.msg==1){
                        this.getData();
                        setTimeout(() => {
                            this.$message.success('删除成功');
                        }, 1500);
                    }
                })
            })
            .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 批量删除
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
                    this.$http.post('/api/deleteManyShop',{
                        ids:ids
                    })
                    .then(res=>{
                        if(res.status==200){
                            this.reset();
                            setTimeout(() => {
                                this.$message.success('删除成功');
                            }, 1500);
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
            this.updateShopId = row._id;
            this.updateShopName = row.shopName;
            this.updateTypeId = row.typeId;
            this.updatepoint = row.point;
            this.updateMoney = row.money;
            this.updateshopImg = row.shopImg;
            this.updateStock = row.stock;
            this.updatePics = row.pics;

            this.updateHeadImgFlag = 1;
            this.fileList = []
            // 商品详情图
            if(this.updatePics){
                this.updatePics.forEach(item=>{
                    this.fileList.push({
                        url:this.imgBaseUrl+item,
                        noBaseUrl:item,
                        response:{
                            result:{
                                data:item
                            }
                        }
                    })
                })
            }
            this.editVisible = true;
        },
        // 保存修改
        saveEdit() {
            var updateShop = {
                _id:this.updateShopId,
                shopName:this.updateShopName,
                typeId:this.updateTypeId,
                point:this.updatepoint,
                money:this.updateMoney,
                shopImg:this.updateshopImg,
                stock:this.updateStock,
                pics:this.updatePics
            }
            this.$http.post('/api/updateShopAll',updateShop)
            .then(res=>{
                if(res.status==200){
                    this.shopTypeList.forEach(item=>{
                        if(item._id==updateShop.typeId){
                            updateShop.typeDetails = []
                            updateShop.typeDetails.push({shopType:item.shopType})
                        }
                    })
                    this.$set(this.shopList, this.idx, updateShop);
                    this.$message.success(`修改成功`);
                    // 关闭
                    this.editVisible = false;
                }
            })
            .catch(error=>{
                console.log(error)
            })
        },
         // 修改：商品主图片上传
        handleAvatarSuccess2(res, file) {
            if (res.status === '0') {
                this.$message.success(res.msg)
                this.updateshopImg = res.result.data
            } else {
                this.$message.error(res.msg)
            }
        },
        // 修改：删除商品详图
        handleRemove2(file, fileList) {
            this.updatePics = [];
            fileList.forEach((item,index)=>{
                this.updatePics.push(item.response.result.data)
            })
        },
        // 修改：商品详图上传成功后
        handleShopDetailSuccess2(res, file, fileList){
            this.updatePics = [];
            fileList.forEach((item,index)=>{
                this.updatePics.push(item.response.result.data)
            })
        },
        // 取消修改
        editCancel () {
            this.fileList = []
            this.editVisible = false
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
            // 添加商品
            this.$http.post('/api/addShop',this.addShop)
            .then(res => {
                if(res.status == 200){
                    this.reset()
                    this.$message.success(`添加成功`);
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        // 添加：商品主图片上传
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
        // 添加：删除商品详图
        handleRemove(file, fileList) {
            this.shopDetailImg = [];
            fileList.forEach((item,index)=>{
                 this.shopDetailImg.push(item.response.result.data)
            })
        },
        // 添加：放大商品图
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 添加：商品详图上传成功后
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
  /* 搜索 */
  .search_wrap{
      float: right;
  }
  /* 修改图片 */
  .shopic_main{
      width: 100%;
      height: 100%;
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
