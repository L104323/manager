<template>
    <div class="sidebar">
        <!--             background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff" -->
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'user',
                    title: '用户管理'
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '2',
                    title: '垃圾分类',
                    subs: [
                        {
                            icon: 'el-icon-lx-cascades',
                            index: 'categoryGarbage',
                            title: '垃圾分类查询管理'
                        },
                        {
                            icon: 'el-icon-lx-cascades',
                            index: 'garbageExplain',
                            title: '垃圾分类介绍管理'
                        }
                    ]
                 },
                {
                    icon: 'el-icon-lx-cascades',
                    index: 'question',
                    title: '题库管理'
                },
                {
                    icon: 'el-icon-lx-copy',
                    index: 'point',
                    title: '积分管理'
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '3',
                    title: '商品管理',
                    subs: [
                        {
                            icon: 'el-icon-lx-emoji',
                            index: 'shopType',
                            title: '商品类型管理'
                        },
                        {
                            icon: 'el-icon-lx-global',
                            index: 'shop',
                            title: '商品管理'
                        }
                    ]
                },
                {
                    icon: 'el-icon-pie-chart',
                    index: 'Order',
                    title: '兑换订单管理'
                },
                {
                    icon: 'el-icon-lx-emoji',
                    index: 'shopCar',
                    title: '购物车管理'
                },
                 {
                    icon: 'el-icon-rank',
                    index: 'address',
                    title: '地址管理'
                },
                // {
                //     icon: 'el-icon-lx-calendar',
                //     index: '3',
                //     title: '表单相关',
                //     subs: [
                //         {
                //             index: 'form',
                //             title: '基本表单'
                //         },
                //         {
                //             index: '3-2',
                //             title: '三级菜单',
                //             subs: [
                //                 {
                //                     index: 'editor',
                //                     title: '富文本编辑器'
                //                 },
                //                 {
                //                     index: 'markdown',
                //                     title: 'markdown编辑器'
                //                 }
                //             ]
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-warn',
                //     index: '7',
                //     title: '错误处理',
                //     subs: [
                //         {
                //             index: 'permission',
                //             title: '权限测试'
                //         },
                //         {
                //             index: '404',
                //             title: '404页面'
                //         }
                //     ]
                // }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 180px;
}
.sidebar > ul {
    height: 100%;
}
</style>
