<template>
    <div id="app">
        <router-view v-if="routerAlive"></router-view>
    </div>
</template>

<script>
export default {
  data(){
    return{
      routerAlive:true
    }
  },
  provide(){
    return {
      routerRefresh: this.routerRefresh
    }
  },
  methods:{
    routerRefresh(){
      this.routerAlive = false;
      this.$nextTick(()=>{
          this.routerAlive = true;
      });
    },
  }

}
</script>

<style>
    @import "./assets/css/main.css";
   /* @import "./assets/css/color-dark.css"; */    /*深色主题*/
    @import "./assets/css/theme-green/color-green.css";   /*浅绿色主题*/
</style>