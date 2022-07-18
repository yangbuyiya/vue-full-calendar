<template>
  <div class="app-container">
    <!-- 日程表 -->
    <div class="top" style="background: #fff; padding: 8px 6px;margin: 0 auto;width: 80%;">
      <!--    <div class="modelBox">-->
      <!--      <span class="radis"></span>-->
      <!--      <span style="color: black; font-size: 16px; font-weight: bold">会议记录</span>-->
      <!--    </div>-->
      <div class="tabs" style="width: 100%">
        <FullCalendar ref="fullCalendar"
                      :options="calendarOptions" class="demo-app-calendar"
        />
      </div>
      <!--  删除 更新  -->
      <el-dialog title="日程" v-if="dialogVisible" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
        <div>
          <el-form class="info" :rules="rules" ref="updateForm" label-position="left" :model="updateForm"
                   label-width="120px"
          >
            <el-row>
              <el-col :span="10">
                <el-form-item label="活动标题:" prop="title">
                  <el-input v-model="updateForm.title" style="display: inline-block"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="display: block;text-align: left;margin-left: 10px;">
                <el-color-picker v-model="updateForm.backgroundColor"></el-color-picker>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="活动内容:" prop="text">
                  <el-input type="textarea" size="small" v-model="updateForm.text" :rows="5"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24">
              <el-col :span="24">
                <el-form-item label="参加人员:" prop="userList" style="width: 100%;text-align: left;">
                  <el-input type="textarea" size="small" v-model="updateForm.userList" :rows="5"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24">
              <el-col :span="24">
                <el-form-item label="会议室:" prop="meetingRoom" style="width: 100%;text-align: left;">
                  <el-input type="textarea" size="small" v-model="updateForm.meetingRoom" :rows="5"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24">
              <el-col :span="24">
                <el-form-item label="活动时间:" prop="datePicker" style="width: 100%;text-align: left;">
                  <el-date-picker
                      v-model="updateForm.datePicker"
                      type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      range-separator="至"
                      start-placeholder="开始日期"
                      :default-time="['00:00:00', '23:59:59']"
                      end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>


          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false;getList()">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import tippy from 'tippy.js'
import moment from 'moment'
// import {deleteById, getListByDateTime, saveOrUpdate} from '@/api/oa/workCalendarItems'

export default {
  name: 'fullCalendar',
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [
          // 加载插件，V5采用插件模块方式加入
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin // needed for dateClick
        ],
        height: 800, //日历高度
        headerToolbar: {
          // 头部toolba
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        defaultView: 'month', //显示默认视图
        weekMode: 'liquid', //在月视图里显示周的模式，因为每月周数可能不同，所以月视图高度不一定。fixed：固定显示6周高，日历高度保持不变liquid：不固定周数，高度随周数变化variable：不固定周数，但高度固定
        weekNumbers: true, //是否在视图左边显示这是第多少周，默认false
        eventLimit: 5, // 限制显示
        handleWindowResize: true, //随浏览器窗口变化
        initialView: 'dayGridMonth', // 初始化插件显示
        initialDate: new Date(), //初始化日期
        // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        editable: true, //是否可编辑
        droppable: true,//可拖拽的
        // timeZone: ,//采用时区
        selectable: true,
        // selectMirror: true,
        dayMaxEvents: true,
        weekends: true, // 是否显示一周七天
        select: this.handleDateSelect, // 点击空白区域出触发
        eventMouseEnter: this.handleEventMouseEnter, // 用户将鼠标悬停在事件上时触发
        datesSet: this.handleEvents,
        // dateClick: this.handleDateClick,//日期方格点击事件
        eventClick: this.eventClick, //日程点击事件
        eventDragStop: this.eventDropStart, // 事件拖动停止 拖拽触发
        eventDrop: this.eventDropEnd, // 拖拽完毕给的参数是最新的
        locale: zhCnLocale,
        timeFormat: 'HH:mm',
        // timeZone: 'Asia/Shanghai',
        // nextDayThreshold: "00:00:00",// 关闭维度
        // 日历数据
        events: []
        // datesSet: this.handleDateSet,
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      },
      // 初始化ID
      count: 1,
      // 删除 更新
      dialogVisible: false,
      // 暂存新增数据
      temporaryStorage: [],
      updateForm: {
        id: null,
        // 标题
        title: '',
        // 紧急颜色标记
        backgroundColor: '',
        // 会议内容
        text: '',
        // 参加会议人员
        userList: '',
        // 会议室
        meetingRoom: '',
        // 时间
        datePicker: [],
        start: '',
        end: ''
      },
      // 会议时间
      datePicker: [],
      // 监听双击
      deleteCount: 0,
      // 记录分页触发
      paginationDateTime: [],
      //
      events: [],
      // 校验表单
      rules: {
        datePicker: [
          {required: true, message: '请选择会议日期', trigger: 'change'}
        ],
        'title': [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        'text': [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ],
        'userList': [
          {required: true, message: '请输入参加人员', trigger: 'blur'}
        ],
        'meetingRoom': [
          {required: true, message: '请输入会议室', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 根据日期获取时间集合
    getList() {
      // 请求 开始时间 - 结束时间
      // getListByDateTime(this.paginationDateTime[0], this.paginationDateTime[1]).then(res => {
      //   this.calendarOptions.events = res.data
      // })
    },
    // 选中白色区域的时候 (新增)
    handleDateSelect(time) {
      // 点击弹出用户输入
      this.reset()
      this.updateForm.datePicker = this.reloadDateTime(time.start, new Date(time.end) - 1)
      setTimeout(() => {
        this.dialogVisible = true
      }, 10)
    },
    // 拖拽触发
    eventDropStart(dropInfo) {
      // 给的参数还是拖拽前的 所以 这个不能用
      console.log('拖拽了前位置:', dropInfo)
    },
    // 拖拽新的位置
    eventDropEnd(dropInfo) {
      // 更新一下新的位置
      let newData = dropInfo.event
      let find = this.calendarOptions.events.find(e => e.id == newData.id)
      let dateTime = this.reloadDateTime(newData.start, newData.end)

      find.start = dateTime[0]
      find.end = dateTime[1]

      // // 新增 or 更新
      // saveOrUpdate(find).then(res => {
      //   if (res.code == 200) {
      //     this.msgSuccess(res.msg)
      //     this.getList()
      //   } else {
      //     this.msgError(res.msg)
      //   }
      // })

      // 模拟位置更新
      let index = this.calendarOptions.events.findIndex(e => e.id == newData.id);
      let newVal = {
        id: newData.id,
        title: newData.title,
        text: newData.extendedProps.text,
        backgroundColor: newData.backgroundColor,
        start: find.start,
        end: find.end,
      };
      this.calendarOptions.events.splice(index, 1, newVal)
      console.log(this.calendarOptions.events);

    },
    // 更新事件数据并且保存数据库
    eventClick(calEvent) {
      let event = this.calendarOptions.events.find(e => e.id == calEvent.event.id)
      // 短时间双击2下为删除-弹出
      this.deleteCount++
      if (this.deleteCount > 2) return
      setTimeout(() => {
        if (this.deleteCount === 1) {
          // 进行单击事件处理 -- 打开弹出 更新操作
          this.dialogVisible = true
          let time = this.reloadDateTime(event.start, event.end)
          this.updateForm = event
          // 会议时间
          this.updateForm.datePicker = time;
        } else if (this.deleteCount === 2) {
          this.$confirm('是否继续删除【' + event.title + '】事件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 进行双击事件处理 删除操作
            // deleteById(calEvent.event.id).then(res => {
            //   if (res.code == 200) {
            //     this.msgSuccess(res.msg)
            //     this.getList()
            //   } else {
            //     this.msgError(res.msg)
            //   }
            // })


            // 模拟删除
            let index = this.calendarOptions.events.findIndex(e => e.id === calEvent.event.id);
            this.calendarOptions.events.splice(index, 1)
            console.log("删除完毕:", this.calendarOptions.events);

          }).catch(() => {
          })
        }
        // 改为0
        this.deleteCount = 0
      }, 300)
    },
    // 提交新增or更新
    submit() {
      // this.$refs['updateForm'].validate((valid) => {
      //   if (valid) {
      //     // 拿到当前点击的(更改的)
      //     this.updateForm.start = this.updateForm.datePicker[0]
      //     this.updateForm.end = this.updateForm.datePicker[1]
      //     // 新增 or 更新
      //     saveOrUpdate(this.updateForm).then(res => {
      //       if (res.code == 200) {
      //         this.msgSuccess(res.msg)
      //         this.getList()
      //       } else {
      //         this.msgError(res.msg)
      //       }
      //     })
      //     this.dialogVisible = false
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })


      // 模拟提交
      this.updateForm.start = this.updateForm.datePicker[0];
      this.updateForm.end = this.updateForm.datePicker[1]

      if ([null, undefined, ''].includes(this.updateForm.id)) {
        // 模拟新增
        this.updateForm.id = this.count ++;
        // 新增数据
        console.log(this.updateForm);
        this.calendarOptions.events.push(this.updateForm);
      } else {
        // 更新
        let index = this.calendarOptions.events.findIndex(e => e.id === this.updateForm.id);
        this.calendarOptions.events.splice(index, 1, this.updateForm)
      }
      console.log("提交：", this.calendarOptions.events);
      this.dialogVisible = false;

    },
    // 用户将鼠标悬停在事件上时触发,这里数据做了类型判断，不同的类型数据页面悬浮框显示不用的内容
    handleEventMouseEnter(info) {
      let eve = this.calendarOptions.events.find(e => e.id == info.event.id)
      // 会议内容处理
      let newVar = eve.text  // && eve.text.length > 10 ? eve.text.substr(0, 10) + '...' : eve.text
      // 时间处理
      let dateTime = this.reloadDateTime(eve.start, new Date(eve.end) - 1)
      tippy(info.el, {
        content: `
         <div style="width: 430px;z-index:9999;background: #fff !important;line-height: 1.6;border-radius:4px;border:1px solid #ebeef5;padding:12px;color:#606266;line-height:1.4;text-align:justify;font-size:14px;word-break:break-all;overflow: hidden">
        <div style="white-space:normal;overflow:auto;table-layout:fixed;word-break:break-all;height:auto;display:inline-block;width: 100%;">
        <span style="display:inline-block;width:6px;height:6px;background-color:#318DDE;border-radius:50%;margin:0 5px;vertical-align:center;line-height:6px;"></span>
        会议名称：${eve.title}</div>
        <p style="width: 100%;"><span style="display:inline-block;width:6px;height:6px;background-color:#318DDE;border-radius:50%;margin:0 5px;vertical-align:center;line-height:6px;"></span>
        会议内容：${newVar}</p>
        <div style="width: 100%;"><span style="display:inline-block;width:6px;height:6px;background-color:#318DDE;border-radius:50%;margin:0 5px;vertical-align:center;line-height:6px;"></span>
        会议时间：${dateTime[0]} - ${dateTime[1]}</div>
      </div>
        `,
        allowHTML: true, //是否允许html文本
        zIndex: 9999
      })
    },
    // 监听分页
    handleEvents(time) {
      let start = time.start
      let end = time.end // 如果是 4到7日 那么拿到最后的是 4-8 相当于 4-7 他会加1
      // 第一次进来会触发这个 我们保存一下这个时间 防止点击日程也会被触发
      let dateTime = this.reloadDateTime(start, new Date(end) - 1)

      let startFormat = dateTime[0]
      let endFormat = dateTime[1]

      if (this.paginationDateTime.length === 0) {
        this.paginationDateTime[0] = startFormat
        this.paginationDateTime[1] = endFormat
      } else {
        // 如果时间都是记录的原有时间那么 不是点击的 分页
        if ((startFormat != this.paginationDateTime[0] && endFormat != this.paginationDateTime[1])) {
          // 开始调用后台 传递下个月或上个月的时间
          console.log('切换完毕:', startFormat, endFormat)
          this.paginationDateTime[0] = startFormat
          this.paginationDateTime[1] = endFormat
        } else {
          // console.log('触发了其他的，导致分页', startFormat, endFormat)
        }
      }
    },
    handleClose(done) {
      done()
    },
    reset() {
      // this.$refs['updateForm'].resetFields()
      this.updateForm = {
        id: null,
        // 标题
        title: '',
        // 紧急颜色标记
        backgroundColor: '',
        // 会议内容
        text: '',
        // 参加会议人员
        userList: '',
        // 会议室
        meetingRoom: '',
        // 时间
        datePicker: [],
        start: '',
        end: ''
      }
    },
    // 时间优化
    reloadDateTime(s, e) {
      // 时间处理
      let start = moment(s).format('YYYY-MM-DD HH:mm:ss')
      let end = moment(e).format('YYYY-MM-DD HH:mm:ss')

      // // 判断是否为时间精度
      if (s.length <= 10) {
        // 不精确到时分秒
        start = moment(s).format('YYYY-MM-DD HH:mm:ss').replace(' 00:00:00', '')
        end = moment(e).format('YYYY-MM-DD HH:mm:ss').replace(' 00:00:00', '')
      } else {
        // 有时分秒
        start = moment(s).format('YYYY-MM-DD HH:mm:ss')
        end = moment(e).format('YYYY-MM-DD HH:mm:ss')
      }
      return [start, end]
    },
    // 获取与毫秒数的转化比例（相差天数：1，相差小时数：2，相差分钟数：3，相差秒数：4）
    getDifferScale(value) {
      let format
      // 获取转化比（天数跟毫秒数的比例）
      if (value === 1) {
        format = parseFloat(24 * 60 * 60 * 1000)
      } else if (value === 2) { // 获取转化比（小时数跟毫秒数的比例）
        format = parseFloat(60 * 60 * 1000)
      } else if (value === 3) { // 获取转化比（分钟数跟毫秒数的比例）
        format = parseFloat(60 * 1000)
      } else if (value === 4) { // 获取转化比（秒数跟毫秒数的比例）
        format = parseFloat(1000)
      }
      return format
    },
    getDifferDate(firstDate, secondDate, diff) {
      // 获取两个日期的相差日期数(differ 相差天数：1、相差小时数：2、相差分钟数：3、相差秒数：4)
      // 1)将两个日期字符串转化为日期对象
      let startDate = new Date(firstDate)
      let endDate = new Date(secondDate)
      // // 2)计算两个日期相差的毫秒数
      let msecNum = endDate.getTime() - startDate.getTime()
      // // 3)计算两个日期相差的天数
      return Math.floor(msecNum / this.getDifferScale(diff))
    }
  },
  mounted() {
    let ths = this
    this.$nextTick(() => {

      if (this.paginationDateTime.length >= 2) {
        this.getList()
      }

      let first = document.querySelectorAll('.fc-prev-button')[0]
      first.addEventListener('click', function () {
        ths.getList()
      })

      let next = document.querySelectorAll('.fc-next-button')[0]
      next.addEventListener('click', function () {
        ths.getList()
      })

      let dayGridMonth = document.querySelectorAll('.fc-dayGridMonth-button')[0]
      dayGridMonth.addEventListener('click', function () {
        ths.getList()
      })

      let timeGridWeek = document.querySelectorAll('.fc-timeGridWeek-button')[0]
      timeGridWeek.addEventListener('click', function () {
        ths.getList()
      })

      let timeGridDay = document.querySelectorAll('.fc-timeGridDay-button')[0]
      timeGridDay.addEventListener('click', function () {
        ths.getList()
      })

      // 监听今天的
      let querySelectorAll = document.querySelectorAll('.fc-today-button')[0]
      querySelectorAll.addEventListener('click', function () {
        if (ths.paginationDateTime.length >= 2) {
          ths.getList()
        }
      })
    })
  }
}
</script>

<style scoped>
/*自定义样式*/
.displayNone {
  display: none !important;
}

/* 按钮样式 */

/deep/ .fc-button {
  box-shadow: none !important;
  user-focus: none !important;
  text-underline: none !important;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: .1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
}

/deep/ .fc-next-button, /deep/ .fc-prev-button,
/deep/ .fc-next-button, /deep/ .fc-dayGridMonth-button,
/deep/ .fc-timeGridWeek-button, /deep/ .fc-timeGridDay-button {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  border-left: 1px solid rgba(255, 255, 255, 0.72) !important;
}

/deep/ .fc-prev-button:hover {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

/deep/ .fc-prev-button:active {
  color: #fff;
  background-color: #409eff !important;
  border-color: #409eff !important;
}

/deep/ .fc-next-button:hover {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

/deep/ .fc-next-button:active {
  color: #fff;
  background-color: #409eff !important;
  border-color: #409eff !important;
}

/deep/ .fc-today-button:hover {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

/deep/ .fc-today-button:active {
  color: #fff;
  background-color: #fff !important;
  border-color: #dcdfe6 !important;
}

/deep/ .fc .fc-button-primary:disabled {
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
}

/deep/ .fc .fc-popover {
  z-index: 1999 !important;
}

/deep/ .fc-h-event {
  border: none !important;
  padding: 1px;
  box-sizing: border-box;
}

/deep/ .fc .fc-button-primary:not(:disabled):hover {
  color: #fff;
  background-color: #9bc7f3;
  border-color: #9bc7f3;
}

/deep/ .fc .fc-button-primary:not(:disabled):active,
/deep/ .fc .fc-button-primary:not(:disabled).fc-button-active {
  color: #fff;
  background-color: #9bc7f3;
  border-color: #9bc7f3;
}

/deep/ .fc-v-event {
  border: none;
}

/deep/ .fc-timegrid-col-events {
  z-index: 5 !important;
}

body {
  overflow: hidden !important;
}
</style>
