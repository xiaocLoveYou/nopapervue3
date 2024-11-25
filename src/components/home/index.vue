<template>
    <div>
        <el-container>
            <el-header style="display: flex; padding-left: 15px; align-items: center; background: #455a83; justify-content: space-between">
                <h1 style="color: #fff">基于大数据决策系统的无纸化请假系统</h1>
                <el-image :src="img" style="height: 70%; border-radius: 50%"></el-image>
            </el-header>
            <el-main>
                <el-row>
                    <el-col :span="12">
                        Hello
                    </el-col>
                    <el-col :span="12">
                        hello
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>

import router from "@/router";
import img from "@/assets/img.png"

export default {
    name: router,
    data() {
        return {
            ip: "",
            img: img,
            username: "",
            password: "",
        };
    },
    methods: {
        getData() {
            console.log(123123)
        },
    },
    created() {
        this.ip = this.$BaseIp;
        this.getData()
    }
};
</script>

<style>
</style>


