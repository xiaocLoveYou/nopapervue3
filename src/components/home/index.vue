<template>
    <div>
        <el-container>
            <el-header
                style="display: flex; padding-left: 2.3%; align-items: center; background: #2E59A7; justify-content: space-between">
                <el-popconfirm title="打开可视化大屏" @confirm="window_href" style="padding-left: 30%">
                    <template #reference>
                        <h1 style="color: #fff">基于大数据决策系统的无纸化请假系统</h1>
                    </template>
                </el-popconfirm>
                <el-popconfirm title="退出登录" @confirm="logout">
                    <template #reference>
                        <el-image :src="img" style="height: 70%; border-radius: 50%"></el-image>
                    </template>
                </el-popconfirm>
            </el-header>
            <el-main>
                <el-row>
                    <el-col :span="12" style="padding: 1%; height: 45vh">
                        <el-card style="width: 100%; height: 100%;">
                            <template #header>
                                <div class="card-header">
                                    <h2>用户信息</h2>
                                </div>
                            </template>
                            <el-row>
                                <el-col :span="16" style="padding: 1%">
                                    <el-descriptions :column="2" size="large" direction="vertical">
                                        <el-descriptions-item label="姓名:">{{ info.user_name }}</el-descriptions-item>
                                        <el-descriptions-item label="角色:">
                                            <el-tag size="default">{{
                                                    info.role == 'teacher' ? '老师' : info.role == 'normal' ? '学生' : '系部管理'
                                                }}
                                            </el-tag>
                                        </el-descriptions-item>
                                        <el-descriptions-item label="所在班级:">{{
                                                info.class_name
                                            }}
                                        </el-descriptions-item>
                                        <el-descriptions-item label="所在系部:">{{
                                                info.department_name
                                            }}
                                        </el-descriptions-item>
                                        <el-descriptions-item label="当前时间:">
                                            {{ currentTime }}
                                        </el-descriptions-item>
                                        <el-descriptions-item label="班级总人数:">
                                            {{ students.length }} 人
                                        </el-descriptions-item>
                                        <el-descriptions-item label="提交请假申请">
                                            <el-button type="primary" :disabled="info.role!='normal'"
                                                       @click="leavesVisible = !leavesVisible">提交请假申请
                                            </el-button>
                                        </el-descriptions-item>
                                        <el-descriptions-item label="审批请假申请">
                                            <el-button type="success"
                                                       :disabled="info.role=='normal' || students.length == todayAttendance.length"
                                                       @click="checkVisible = !checkVisible">提交考勤状态
                                            </el-button>
                                        </el-descriptions-item>
                                    </el-descriptions>
                                </el-col>
                                <el-col :span="8" style="padding: 1%">
                                    <el-image :src="avator" style="border-radius: 50%; width: 100%"></el-image>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                    <el-col :span="12" style="padding: 1%; height: 45vh">
                        <el-card style="width: 100%; height: 100%;">
                            <template #header>
                                <div class="card-header">
                                    <h2>到校情况分析</h2>
                                </div>
                            </template>
                            <div id="chart1" style="width: 100%; height: 33vh;margin-top: -10px"></div>
                        </el-card>
                    </el-col>
                    <el-col :span="12" style="padding: 1%; height: 45vh">
                        <el-card style="width: 100%; height: 100%;">
                            <template #header>
                                <div class="card-header">
                                    <h2>签到情况分析</h2>
                                </div>
                            </template>
                            <el-empty description="暂无数据" v-show="emptyvis"/>
                            <div id="chart2" style="width: 100%; height: 38vh;margin-top: -5%" v-show="!emptyvis"></div>
                        </el-card>
                    </el-col>
                    <el-col :span="12" style="padding: 1%; height: 45vh">
                        <el-card style="width: 100%; height: 100%;">
                            <template #header>
                                <div class="card-header">
                                    <h2 v-show="info.role != 'normal'">签到审计情况</h2>
                                    <h2 v-show="info.role == 'normal'">请假申请情况</h2>
                                </div>
                            </template>
                            <el-scrollbar ref="scrollbarRef" height="400px" always @scroll="scroll">
                                <el-table
                                    ref="singleTableRef"
                                    :data="tableData"
                                    highlight-current-row
                                    style="width: 100%"
                                    @current-change="handleCurrentChange"
                                >
                                    <el-table-column type="index" width="50"/>
                                    <el-table-column property="date" label="日期" width="120"/>
                                    <el-table-column property="name" label="姓名" width="120"/>
                                    <el-table-column property="resion" label="请假原因"/>
                                    <el-table-column property="tag" label="状态标签" width="100">
                                        <template #default="scope">
                                            <el-tag
                                                :type="scope.row.tag === '已审批' ? 'primary' : scope.row.tag == '未审批'? 'error': 'success'"
                                                disable-transitions>
                                                {{ scope.row.tag }}
                                            </el-tag>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-scrollbar>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>

        <!--    学生请假弹窗    -->
        <el-dialog v-model="leavesVisible" title="提交学生请假申请" width="800" draggable>
            <!--            <span>提交学生请假申请</span>-->
            <el-form :model="leavesform" class="demo-form-inline">
                <el-form-item label="请假分类">
                    <el-radio-group v-model="leavesform.status">
                        <el-radio :value="'3'">病假</el-radio>
                        <el-radio :value="'4'">事假</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="请假原因">
                    <el-input v-model="leavesform.resion" placeholder="请输入请假原因" clearable/>
                </el-form-item>
                <el-form-item label="请假时间">
                    <el-date-picker
                        v-model="leavesform.date"
                        type="date"
                        placeholder="请选择请假时间"
                        :disabled-date="dateDisabler"
                        clearable
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="leavesVisible = false">取消</el-button>
                    <el-button type="primary" @click="leaves">提交</el-button>
                </div>
            </template>
        </el-dialog>


        <!--    老师审批弹窗    -->
        <el-dialog v-model="checkVisible" title="老师提交全班考勤状态" width="800" draggable>
            <!--            <span>提交学生请假申请</span>-->

            <el-collapse>
                <el-collapse-item :title="item.username" v-for="(item, index) in todayAttendance" :key="index">
                    <div v-show="item.resion != null">
                        <span style="font-weight: bold">请假原因:</span>
                        <div>{{ item.resion }}</div>
                        <el-radio-group v-model="item.checked">
                            <el-radio :value="false">拒批</el-radio>
                            <el-radio :value="true">批准</el-radio>
                        </el-radio-group>
                    </div>
                    <el-empty description="暂无数据" v-show="item.resion == null"/>
                </el-collapse-item>
                <el-empty description="暂无请假数据" v-show="todayAttendance.length == 0 && getleaveserror.length == 0"/>
                <el-tag type="danger" v-for="(item,index) in getleaveserror" :key="index" style="margin: 10px" v-show="item.status=='正常'"> {{ item.tag }}</el-tag>
            </el-collapse>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="checkVisible = false">取消</el-button>
                    <el-popover
                        placement="top-start"
                        title="提示"
                        :width="250"
                        trigger="hover"
                        content="仅审批请假学生即可，提交考勤后其余学生自动标记到校.">
                        <template #reference>
                            <el-button type="primary" @click="checks">提交</el-button>
                        </template>
                    </el-popover>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>

import router from "@/router";
import img from "@/assets/img.png"
import {
    attendancelist,
    get_chart1,
    get_chart2,
    get_students,
    get_todayAttendance, getleaveserror,
    info,
    student_createLeaves, upload_attendance
} from "@/API/auth";
import headimg from "@/assets/headimg_dl.png"
import * as echarts from 'echarts';
import {ElMessage} from "element-plus";

export default {
    name: router,
    data() {
        return {
            ip: "",
            checkvalue: [],
            img: img,
            select_date: "2024-10-01",
            avator: headimg,
            datetime: "",
            info: "",
            currentTime: this.getCurrentTime(),
            students: [],
            tableData: [],
            leavesVisible: false,
            leavesform: {
                date: "",
                name: "",
            },
            emptyvis: false,
            checkVisible: false,
            data: [],
            todayAttendance: [],
            isCheck: false,
            getleaveserror: []
        };
    },
    methods: {
        getData() {
            info().then(res => {
                console.log(res)
                this.info = res.data;
            })
            get_chart2().then(res => {
                // console.log(res)
                var dom = document.getElementById('chart1');
                var myChart = echarts.init(dom);

                var option = {
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: false
                            },
                            saveAsImage: {
                                pixelRatio: 2
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        bottom: 90
                    },
                    dataZoom: [{
                        type: 'inside'
                    },
                        {
                            type: 'slider'
                        }
                    ],
                    xAxis: {
                        data: Array.from(new Set(res.data.map(item => item.date))),
                        silent: false,
                        splitLine: {
                            show: false
                        },
                        splitArea: {
                            show: false
                        }
                    },
                    yAxis: {
                        splitArea: {
                            show: false
                        }
                    },
                    legend: {
                        data: ['在校人数', '请假人数']
                    },
                    series: [{
                        name: '在校人数',
                        type: 'bar',
                        data: res.data.filter(item => item.status == '正常到校').map(item => item.count),
                        stack: 'stack1',
                        large: true,
                        itemStyle: {
                            color: 'rgba(75, 192, 192, 0.8)'
                        }
                    }, {
                        name: '请假人数',
                        type: 'bar',
                        data: res.data.filter(item => item.status == "请假").map(item => item.count),
                        stack: 'stack1',
                        large: true,
                        itemStyle: {
                            color: 'rgba(255, 99, 132, 0.8)'
                        }
                    }]
                }
                myChart.setOption(option);
                // 窗口大小变化时，重新调整图表尺寸
                window.addEventListener('resize', () => {
                    myChart.resize();
                });
            })
            get_students().then(res => {
                console.log(res)
                this.students = res.data
            })
            get_todayAttendance().then(res => {
                console.log(res)
                this.todayAttendance = res.data.map(item => {
                    item.checked = false
                    return item
                });
                this.isCheck = this.students.length == res.data.length
            })
            getleaveserror().then(res => {
                console.log(res)
                this.getleaveserror = res.data
            })
            this.vischart1()
            this.getattendancelist()
        },
        vischart1() {
            get_chart1().then(res => {
                console.log(12312312313, res)
                var dom = document.getElementById('chart2');
                var myChart2 = echarts.init(dom);
                if (res.code != 200 || res.data.length == 0) {
                    this.emptyvis = true
                    return
                }
                var option = {
                    series: [{
                        type: 'gauge',
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FAC858'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        data: [{
                            value: res.data[0].sum || 0,
                            name: res.data[0].status || '事假未批准',
                            title: {
                                offsetCenter: ['-200%', '60%']
                            },
                            detail: {
                                offsetCenter: ['-200%', '80%']
                            }
                        }, {
                            value: res.data[1].sum || 0,
                            name: res.data[1].status || '病假未批准',
                            title: {
                                offsetCenter: ['-200%', '20%']
                            },
                            detail: {
                                offsetCenter: ['-200%', '40%']
                            }
                        }, {
                            value: res.data[2].sum || 0,
                            name: res.data[2].status || '事假已批准',
                            title: {
                                offsetCenter: ['-200%', '-20%']
                            },
                            detail: {
                                offsetCenter: ['-200%', '0%']
                            }
                        }, {
                            value: res.data[3].sum || 0,
                            name: res.data[3].status || '病假已批准',
                            title: {
                                offsetCenter: ['-200%', '-60%']
                            },
                            detail: {
                                offsetCenter: ['-200%', '-40%']
                            }
                        }, {
                            value: res.data[4].sum || 0,
                            name: res.data[4].status || '正常到校',
                            title: {
                                offsetCenter: ['-200%', '-100%']
                            },
                            detail: {
                                offsetCenter: ['-200%', '-80%']
                            }
                        }],
                        detail: {
                            width: 40,
                            height: 14,
                            fontSize: 14,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            borderRadius: 3,
                            formatter: '{value}人'
                        }
                    }]
                }
                myChart2.setOption(option);
                // 窗口大小变化时，重新调整图表尺寸
                window.addEventListener('resize', () => {
                    myChart2.resize();
                });
            })
        },
        getCurrentTime() {
            const now = new Date();
            return now.toLocaleString(); // 格式化时间，使用本地格式
        },
        updateTime() {
            this.currentTime = this.getCurrentTime();
        },
        dateDisabler(date) {
            const now = new Date();
            if (now - date < 0) {
                return false;
            }
            return true;
        },
        selectDateDisabler(date) {
            const now = new Date();
            if (now - date > 0) {
                return false;
            }
            return true;
        },
        leaves() {
            console.log(this.leavesform);
            var date = this.formatDate(this.leavesform.date);
            var status = this.leavesform.status;
            var resion = this.leavesform.resion;
            console.log({
                date: date,
                status: status,
                resion: resion,
            })
            student_createLeaves({
                date: date,
                status: status,
                resion: resion,
            }).then(res => {
                console.log(res);
                if (res.code == 200) {
                    ElMessage({
                        message: '提交成功',
                        type: 'success',
                    })
                }
                this.getattendancelist()
                this.leavesVisible = false;
            })
        },
        checks() {
            console.log(this.todayAttendance)
            console.log(this.students);
            let user_ids = []
            let statuses = []
            let date = this.formatDate(new Date());
            let resions = []

            this.students.forEach(student => {
                var index = this.todayAttendance.findIndex(item => item.user_id == student.user_id);

                if (index == -1) {
                    user_ids.push(student.user_id)
                    statuses.push('0')
                    resions.push(null)
                } else {
                    user_ids.push(student.user_id)
                    statuses.push(this.todayAttendance[index] == "3" ? '1' : '2')
                    resions.push(this.todayAttendance[index].resion)
                }
            })

            console.log(user_ids, statuses, date, resions)

            upload_attendance({
                user_ids: user_ids,
                statuses: statuses,
                date: date,
                resions: resions,
            }).then(res => {
                console.log(res);
                if (res.code == 200) {
                    ElMessage({
                        message: '提交成功',
                        type: 'success',
                    })
                    window.location.reload();
                }

            })

        },
        getattendancelist() {
            attendancelist().then(res => {
                console.log(res)
                res.data.forEach(item => {
                    this.tableData.push({
                        date: item.date,
                        name: item.username,
                        resion: item.resion == "null" || item.resion == null ? "暂无原因" : item.resion,
                        tag: item.status == '1' || item.status == '2' ? "已审批" : item.status == '3' || item.status == '4' ? "未审批" : "正常到校"
                    })
                })
                this.tableData = this.tableData.sort((a, b) => new Date(b.date) - new Date(a.date))
            })
        },
        window_href() {
          window.open('http://111.231.16.133:5231/')
        },
        logout() {
            console.log(123123123)
            router.back()
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    },
    created() {
        this.ip = this.$BaseIp;
        this.getData()
    },
    mounted() {
        // 在组件挂载后，每隔 1 秒更新一次时间
        this.timer = setInterval(this.updateTime, 1000);

    },
};
</script>

<style>
</style>


