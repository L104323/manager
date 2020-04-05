<template>
    <div>
        <!-- <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>基本表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="题目2">
                        <el-input v-model="form.question"></el-input>
                    </el-form-item>
                    <el-form-item label="解析">
                        <el-input type="textarea" rows="5" v-model="form.explain"></el-input>
                    </el-form-item>
                    <el-form-item label="选项">
                        <div class="option_wrap" v-for="(item,index) in form.options" :key="index">
                            <el-input v-model="item.answerContent"></el-input>
                            <el-checkbox v-model="item.isTrue" @change="isChoice(index)"></el-checkbox>
                            <el-button type="danger" @click="deleteOption(index)" class="delete_btn">删除</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="info" plain @click="addOption">添加选项</el-button>
                        <p class="introduce">(说明：选中的选项即为该题目答案)</p>
                    </el-form-item>
                    <el-form-item label="答案:" class="introduce">
                        {{answer}}
                    </el-form-item>
                    <el-form-item class="sure">
                        <el-button type="primary" @click="onSubmit">确认修改</el-button>
                        <router-link to="/question">
                            <el-button>取消</el-button>
                        </router-link>
                        
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    inject:['routerRefresh'],   //在子组件中注入在父组件中创建的属性
    data() {
        return {
            form: {
                question:'', // 题目
                explain:'', // 解析
                options:[  //选项
                    {
                        answerContent:'',
                        isTrue:false
                    }
                ]
            },
            answer:''
        };
    },
    mounted () {
        this.form = this.$route.query
        this.form.options.forEach((item,index)=>{
            if(item.isTrue){
                this.answer = item.answerContent
            }
        })
    },
    methods: {
        onSubmit() {
            var optionsNull = false
            this.form.options.some((item,index)=>{
                if(item.answerContent==''){
                    optionsNull = true
                    return true
                }
            })
            if(optionsNull && this.form.question){
                this.$message.warning('选项不能为空！');
            } else if(optionsNull && this.form.question==''){
                this.$message.warning('选项和题目都不能为空！');
            } else if(optionsNull==false && this.form.question==''){
                this.$message.warning('题目不能为空！');
            } else {
                this.$http.post('/api/updateQuestion',this.form)
                .then(res => {
                    if(res.status==200){
                        this.$message.success('修改成功！');
                        this.$router.push({path:'/question'});
                        this.routerRefresh();//调用app.vue里面的routerRefresh()方法，完成摧毁和重建过程
                    }
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },
        // 添加选项
        addOption () {
            this.form.options.push({
                answerContent:'',
                isTrue:false
            })
        },
        // 删除选项
        deleteOption (index) {
            this.form.options.splice(index,1);
        },
        // 设置答案单选
        isChoice (index,value) {
            if(this.form.options[index].isTrue==true){
                this.answer = this.form.options[index].answerContent
                this.form.options.forEach((item,i)=>{
                    if(i!=index){
                        item.isTrue = false
                    }
                })
            } else {
                this.answer = ''
            }
        }
    }
};
</script>

<style scoped>
    .radio_group{
        width: 100%;
    }
    .option_wrap{
        margin-bottom: .5rem;
    }
    .option_wrap .el-input{
        width: 50%;
        margin-right: 10px;
    }
    .delete_btn{
        margin-left: 2rem;
    }
    .sure{
        margin-top: 3rem;
    }
    .introduce{
        font-size: .8rem;
        color: #666;
    }
</style>