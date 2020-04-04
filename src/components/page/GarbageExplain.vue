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
                <!-- <el-select v-model="query.garbageType" placeholder="请选择分类" class="handle-select mr10">
                    <el-option key="1" label="干垃圾" value="干垃圾"></el-option>
                    <el-option key="2" label="湿垃圾" value="湿垃圾"></el-option>
                    <el-option key="3" label="有害垃圾" value="有害垃圾"></el-option>
                    <el-option key="4" label="可回收垃圾" value="可回收垃圾"></el-option>
                </el-select> -->
                <!-- <el-input v-model="query.garbageName" placeholder="请输入垃圾名称" class="handle-input mr10"></el-input> -->
                <!-- <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->
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
                <el-table-column prop="type" label="分类类型" align="center"></el-table-column>
                <el-table-column label="概念" prop="detail" align="center">
                </el-table-column>
                <el-table-column label="标识图" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="imgBaseUrl+scope.row.img"
                            :preview-src-list="[imgBaseUrl+scope.row.img]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="投放注意事项" prop="garbageType" align="left">
                    <template slot-scope="scope">
                        <p v-for="(item,index) in scope.row.throw" :key="index">
                            {{index+1}}.
                            {{item}}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="主要垃圾" prop="include" align="center"></el-table-column>

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
            <!-- <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div> -->
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="修改" :visible.sync="editVisible" width="30%">
            <el-form ref="form2" label-width="70px">
                <el-form-item label="垃圾名称">
                    <el-input v-model="updateGarbageName"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="updateGarbageType" placeholder="分类" class="handle-select mr10">
                        <el-option key="1" label="干垃圾" value="干垃圾"></el-option>
                        <el-option key="2" label="湿垃圾" value="湿垃圾"></el-option>
                        <el-option key="3" label="有害垃圾" value="有害垃圾"></el-option>
                        <el-option key="4" label="可回收垃圾" value="可回收垃圾"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加弹出框 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="addGarbage" label-width="70px">
                <el-form-item label="垃圾名称">
                    <el-input v-model="addGarbage.garbageName"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="addGarbage.garbageType" placeholder="请选择" class="handle-select mr10">
                        <el-option key="1" label="干垃圾" value="干垃圾"></el-option>
                        <el-option key="2" label="湿垃圾" value="湿垃圾"></el-option>
                        <el-option key="3" label="有害垃圾" value="有害垃圾"></el-option>
                        <el-option key="4" label="可回收垃圾" value="可回收垃圾"></el-option>
                    </el-select>
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
            // 查询参数
            query: {
                garbageName: '', //垃圾名称
                pageIndex: 1,    //页码
                pageSize: 5,     //每页大小
                garbageType:''   //分类
            },
            tableData: [],
            multipleSelection: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 5,
            updateCategory: {}, //修改垃圾分类
            addGarbage: {}, // 添加垃圾分类
            idx: -1,
            id: -1,
            imgBaseUrl:'',//图片基本路径localhost:5000/public
            imgShow: '',//上传图片显示,
            // 编辑
            updateGarbageName:'',
            updateGarbageType:'',
            updateId:''
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.imgBaseUrl= imgUrl;
            this.$http.get('/api/findCategory')
            .then(res=>{
                console.log(res)
                if(res.status==200){
                    this.tableData = res.data;
                }
            })
            .catch(error=>{
                console.log(error)
            })
            // this.$http.post('/api/findGarbage',{
            //     garbageName: '',
            //     pageIndex: 0,
            //     pageSize: 0,
            //     garbageType:''
            // })
            // .then(res=>{
            //     if(res.status==200){
            //         this.pageTotal=res.data.length;
            //     } 
            // })
            // .catch(error=>{
            //     console.log(error)
            // })
            // this.pageInfo()
        },
        // 根据分页信息和用户名称查询用户
        pageInfo(){
            this.$http.post('/api/findGarbage',this.query)
            .then(res=>{
                if(res.status==200){
                    this.tableData = res.data;
                }
            })
            .catch(error=>{
                console.log(error)
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.$http.post('/api/findGarbage',{
                garbageName: this.query.garbageName,
                pageIndex: 0,
                pageSize: 0,
                garbageType:this.query.garbageType
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
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.$http.post('/api/deleteOneGarbage',{
                    id:row._id
                })
                .then(res=>{
                    if(res.status=200){
                        // this.tableData.splice(index, 1);
                        this.query.garbageName='',
                        this.query.garbageType='',
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
            let ids = []; //要删除数据的id
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
                    this.$http.post('/api/deleteManyGarbage',{
                        ids:ids
                    })
                    .then(res=>{
                        if(res.status==200){
                            this.query.garbageName='';
                            this.query.garbageType='';
                            this.query.pageIndex=1;
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
            this.updateGarbageName = row.garbageName;
            this.updateGarbageType = row.garbageType;
            this.editVisible = true;
        },
        // 保存修改
        saveEdit() {
            this.updateCategory={
                id:this.updateId,
                garbageName:this.updateGarbageName,
                garbageType:this.updateGarbageType,
                typeImg:' '
            }
            if(this.updateCategory.garbageType=='干垃圾'){
                this.updateCategory.typeImg='/categoryGarbage/dry.png'
            }
            if(this.updateCategory.garbageType=='湿垃圾'){
                this.updateCategory.typeImg='/categoryGarbage/wet.png'
            }
            if(this.updateCategory.garbageType=='有害垃圾'){
                this.updateCategory.typeImg='/categoryGarbage/harm.png'
            }
            if(this.updateCategory.garbageType=='可回收垃圾'){
                this.updateCategory.typeImg='/categoryGarbage/recyle.png'
            }
            this.editVisible = false;
            this.$http.post('/api/updateGarbage',this.updateCategory)
            .then(res=>{
                if(res.status==200){
                    this.$set(this.tableData, this.idx, this.updateCategory);
                    this.$message.success(`修改成功`);
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
            if(this.addGarbage.garbageType=='干垃圾'){
                this.addGarbage.typeImg='/categoryGarbage/dry.png'
            }
            if(this.addGarbage.garbageType=='湿垃圾'){
                this.addGarbage.typeImg='/categoryGarbage/wet.png'
            }
            if(this.addGarbage.garbageType=='有害垃圾'){
                this.addGarbage.typeImg='/categoryGarbage/harm.png'
            }
            if(this.addGarbage.garbageType=='可回收垃圾'){
                this.addGarbage.typeImg='/categoryGarbage/recyle.png'
            }
            this.$http.post('/api/addGarbage',{
                garbageName: this.addGarbage.garbageName,
                garbageType: this.addGarbage.garbageType,
                typeImg: this.addGarbage.typeImg
            }).then(res=>{
                if(res.status==200){
                    this.query.garbageName='';
                    this.query.garbageType='';
                    this.query.pageIndex=1,
                    this.getData();
                    this.$message.success(`添加成功`);
                }
            }).catch(error=>{
                console.log(error)
            })
            this.addVisible = false;
        },
        handleAvatarSuccess(res, file) {
            this.addUser.imageUrl = URL.createObjectURL(file.raw);
            if (res.status === '0') {
                this.$message.success(res.msg)
                this.addUser.imageUrl = res.result.data
            } else {
                this.$message.error(res.msg)
            }
            this.imgShow = this.imgBaseUrl+ this.addUser.imageUrl;
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
