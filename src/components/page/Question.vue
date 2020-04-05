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
                <router-link to="/addQuestion">
                    <el-button
                        type="primary"
                        icon="el-icon-plus"
                        class="handle-del mr10"
                    >添加</el-button>
                </router-link>
                <el-input v-model="query.question" placeholder="请输入题目" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-search" @click="reset">重置</el-button>
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
                <el-table-column prop="question" label="题目"></el-table-column>
                <el-table-column prop="explain" label="解析"></el-table-column>
                <el-table-column label="选项" width="150">
                    <template slot-scope="scope">
                        <p v-for="(item,index) in scope.row.options" :key="index">
                            {{index+1}}.
                            {{item.answerContent}}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column  label="答案"  width="150">
                     <template slot-scope="scope">
                        <template v-for="(item,index) in scope.row.options">
                            <span v-if="item.isTrue==true" :key="index">{{item.answerContent}}</span>
                        </template>
                    </template>
                </el-table-column>
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
    </div>
</template>

<script>
import { fetchData, deleteUser } from '../../api/index';
export default {
    name: 'basetable',
    inject:['routerRefresh'],   //在子组件中注入在父组件中创建的属性
    data() {
        return {
            query: {
                question: '',
                pageIndex: 1,
                pageSize: 5
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            pageTotal: 0,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            // 查题库，拿总数
            this.$http.get('/api/findAllQuestion')
            .then(res => {
                if(res.status == 200){
                    this.pageTotal = res.data.length
                }
            })
            .catch(error => {
                console.log(error)
            })
            // 分页，初始第一页
            this.pageInfo()
        },
        // 根据分页信息和题目名称查询题目
        pageInfo(){
            this.$http.get('/api/findAllQuestion2',{params:this.query})
            .then(res=>{
                if(res.status==200){
                    this.tableData = res.data;
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
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.$http.get('/api/findAllQuestion',{
                params:{
                    question: this.query.question
                }
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
        reset () {
            this.query = {
                question: '',
                pageIndex: 1,
                pageSize: 5
            },
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            var id = row._id;
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.$http.post('/api/deleteQuestion',{
                    id:row._id
                })
                .then(res=>{
                    if(res.data.msg==1){
                        this.tableData.splice(index, 1);
                        this.query.question='',
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
            let ids = [];
            this.multipleSelection.forEach(item=>{
                ids.push(item._id)
            })
            if(this.multipleSelection.length==0){
                this.$message({
                    message: '请选择要删除的数据',
                    type: 'warning'
                });
            }else{
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    this.$http.post('/api/deleteManyQuestion',{
                        ids:ids
                    })
                    .then(res=>{
                        if(res.status==200){
                            this.query.question='',
                            this.query.pageIndex=1,
                            this.getData();
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
            this.$router.push({path:'/updateQuestion',query:row})
            this.routerRefresh();
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
