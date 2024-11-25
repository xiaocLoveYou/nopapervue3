<template>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <el-card>
            <template #header>
                <div class="card-header" style="display: flex; justify-content: center;">
                    <span>账户密码登录平台</span>
                </div>
            </template>
            <el-row>
                <el-col :span="10">
                    <div class="grid-content ep-bg-purple-dark" style="padding: 20px">
                        <el-image :src="img"></el-image>
                    </div>
                </el-col>
                <el-col :span="14">
                    <div class="grid-content ep-bg-purple-dark" style="padding: 20px"/>
                    <el-form
                        style="max-width: 800px"
                        label-width="auto"
                        :size="size">
                        <el-form-item label="用户名">
                            <el-input v-model="username" type="text"/>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="password" type="password"/>
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
                </el-col>
            </el-row>
        </el-card>

        <video :src="mp4" autoplay loop muted></video>
    </div>
</template>

<script>

import router from "@/router";
import mp4 from "@/assets/login.mp4"
import img from "@/assets/img.png"
import {login} from "@/API/auth";
import {ElMessage} from "element-plus";

export default {
    name: router,
    data() {
        return {
            ip: "",
            mp4: mp4,
            img: img,
            username: "",
            password: "",
        };
    },
    methods: {
        getData() {
            console.log(123123)
        },
        login() {
            login({
                username: this.username,
                password: this.password,
            }).then(res => {
                console.log(res)
                if (res.code === 200) {
                    localStorage.setItem("token", res.token)
                    ElMessage({
                        message: '登录成功',
                        type: 'success',
                    })
                    setTimeout(function () {
                        router.push("/home");
                    }, 1500)
                } else {
                    ElMessage({
                        message: '用户名或密码错误',
                        type: 'error'
                    })
                }
            })
        }
    },
    created() {
        this.ip = this.$BaseIp;
        this.getData()
    },
};
</script>

<style>
video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* 保证视频充满页面且不变形 */
    opacity: 0.65;
    z-index: -1000;
}
</style>


