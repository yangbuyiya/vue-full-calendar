<template>
  <!-- 日程表 -->
  <div class="top" style="background: #fff; padding: 8px 6px">
    <!--    <div class="modelBox">-->
    <!--      <span class="radis"></span>-->
    <!--      <span style="color: black; font-size: 16px; font-weight: bold">会议记录</span>-->
    <!--    </div>-->
    <div class="tabs" style="width: 100%">
      <FullCalendar ref="fullCalendar" :options="calendarOptions" class="demo-app-calendar"/>
    </div>
    <!--  删除 更新  -->
    <el-dialog title="提示" v-if="dialogVisible" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
      <div>
        <el-form class="info" ref="updateForm" label-position="left" :model="updateForm" label-width="150px"
                 size="mini">
          <el-form-item label="事件标题:">
            <el-input v-model="updateForm.title"></el-input>
          </el-form-item>
          <el-form-item label="事件内容:">
            <el-input v-model="updateForm.text"></el-input>
          </el-form-item>
          <el-form-item label="颜色" class="color-picker">
            <el-color-picker v-model="updateForm.backgroundColor"></el-color-picker>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import tippy from "tippy.js";
import moment from "moment";


export default {
  name: "demo2",
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
          interactionPlugin, // needed for dateClick
        ],
        height: "auto", //日历高度
        width: "100%",
        headerToolbar: {
          // 头部toolba
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
          // right: 'dayGridMonth'
        },
        defaultView: "month", //显示默认视图
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
        eventDragStop: this.eventDropStart, // 拖拽后的回调
        eventDrop: this.eventDropEnd,
        locale: zhCnLocale,
        timeFormat: 'HH:mm',
        // timeZone: 'Asia/Shanghai',
        nextDayThreshold: "01:01:01",// 关闭维度
        events: [
          //日程事件的json
          {id: 555, content: '杨不易呀', title: 'event 1', start: '2022-07-02', end: "2022-07-05"},
          {id: 1321, text: '杨不易呀', title: 'event 2', start: '2022-07-18 12:00:00', end: "2022-07-20 13:00:00"},
        ],
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
      updateForm: {},
      // 监听双击
      deleteCount: 0,
      // 记录分页触发
      paginationDateTime: []
    }
  },
  methods: {
    // 选中白色区域的时候 (新增)
    handleDateSelect(time) {
      console.log(time);
      // 判断是否为时间精度
      let date = this.reloadDateTime(time.startStr, time.endStr);
      this.count = this.count + 1
      //添加日历
      let json = {
        id: this.count,
        title: "张三" + ' - ' + "夜班" + this.count,
        text: "张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三",
        backgroundColor: "#3a87ad",
        start: date[0],
        end: date[1]
      };
      //第二种：通过vue的双向绑定
      this.calendarOptions.events.push(json);
    },
    // 拖拽后的
    eventDropStart(dropInfo) {
      console.log("拖拽了前位置:", dropInfo);
    },
    // 拖拽新的位置
    eventDropEnd(dropInfo) {
      let newData = dropInfo.event;
      console.log("拖拽了后的新位置:", newData);
      let strings = this.reloadDateTime(dropInfo.event.startStr, dropInfo.event.endStr);
      console.log(strings);
      let index = this.calendarOptions.events.findIndex(e => e.id == newData.id);
      // 更新一下新的位置
      let newVal = {
        id: newData.id,
        title: newData.title,
        text: newData.extendedProps.text,
        backgroundColor: newData.backgroundColor,
        start: strings[0],
        end: strings[1],
      };
      this.calendarOptions.events.splice(index, 1, newVal)
      console.log(this.calendarOptions.events);
    },
    // 更新事件数据并且保存数据库
    eventClick(calEvent) {
      let event = calEvent.event;
      // 短时间双击2下为删除-弹出
      this.deleteCount++;
      if (this.deleteCount > 2) return;
      setTimeout(() => {
        if (this.deleteCount === 1) {
          // 进行单击事件处理 -- 打开弹出 更新操作
          console.log("单击事件", calEvent);
          this.dialogVisible = true
          // 组装一下表单数据
          let time = this.reloadDateTime(event.startStr, event.endStr);
          this.updateForm = {
            id: event.id,
            title: event.title,
            text: event.extendedProps.text,
            backgroundColor: event.backgroundColor,
            borderColor: event.backgroundColor,
            start: time[0],
            end: time[1],
          }
        } else if (this.deleteCount === 2) {
          this.$confirm('是否继续删除【' + event.title + '】事件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 进行双击事件处理 删除操作
            let getEvents = this.calendarOptions.events;
            if (getEvents && getEvents.length > 0) {
              getEvents.map(item => {
                if (item.id == calEvent.event.id) {
                  let index = this.calendarOptions.events.findIndex(e => e.id === item.id);
                  this.calendarOptions.events.splice(index, 1)
                }
              })
              console.log("删除完毕:", this.calendarOptions.events);
            }
          }).catch(() => {
          });
        }
        // 改为0
        this.deleteCount = 0;
      }, 300);
    },
    // 用户将鼠标悬停在事件上时触发,这里数据做了类型判断，不同的类型数据页面悬浮框显示不用的内容
    handleEventMouseEnter(info) {
      let eve = info.event._def.extendedProps
      // console.log(info);
      // 会议内容处理
      let newVar = eve.text && eve.text.length > 10 ? eve.text.substr(0, 10) + "..." : eve.text;
      // 时间处理
      let start = moment(info.event.start).format('YYYY-MM-DD HH:mm:ss');
      let end = moment(info.event.end).format('YYYY-MM-DD HH:mm:ss');

      // // 判断是否为时间精度
      if (info.event.startStr.length <= 10) {
        // 不精确到时分秒
        start = info.event.startStr;
        end = info.event.endStr;
      } else {
        // 有时分秒
        start = moment(info.event.start).format('YYYY-MM-DD HH:mm:ss');
        end = moment(info.event.end).format('YYYY-MM-DD HH:mm:ss');
      }

      tippy(info.el, {
        content: `<div style='width: 260px;background-color:#FAFAFA;box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);padding:5px;font-size:14px;z-index:99999 !important;'>
                  <div style='display:flex;color: #666666;overflow: hidden;' >
                    <div><span class='item'></span>会议名称： </div>
                    <div class="item-title">${info.event.title}</div>
                  </div>
                  <div><span class='item'></span>会议内容：${newVar}</div>
                  <div><span class='item'></span>会议时间：${start} - ${end}</div>
                </div>`,
        theme: 'light', //主题选取
        animation: 'scale',//显示动画
        // trigger: 'click', //触发类型
        interactive: true, //可交互的
        placement: 'top-start', //悬浮框位置
        allowHTML: true, //是否允许html文本
      })
    },
    // 监听分页
    handleEvents(time) {
      let start = time.start;
      let end = time.end; // 如果是 4到7日 那么拿到最后的是 4-8 相当于 4-7 他会加1
      // 第一次进来会触发这个 我们保存一下这个时间 防止点击日程也会被触发
      let startFormat = moment(start).format('YYYY-MM-DD HH:MM:SS').substr(0, 10);
      let endFormat = moment(end).format('YYYY-MM-DD HH:MM:SS').substr(0, 10)

      if (this.paginationDateTime.length === 0) {
        this.paginationDateTime[0] = startFormat
        this.paginationDateTime[1] = endFormat
      } else {
        // 如果时间都是记录的原有时间那么 不是点击的 分页
        if ((startFormat != this.paginationDateTime[0] && endFormat != this.paginationDateTime[1])) {
          // 开始调用后台 传递下个月或上个月的时间
          console.log("切换完毕:", startFormat);
        } else {
          console.log("触发了其他的，导致分页");
        }
      }
    },
    handleClose(done) {
      done();
    },
    // 提交
    submit() {
      // 拿到当前点击的(更改的)
      let oldData = {
        id: this.updateForm.id,
        title: this.updateForm.title,
        text: this.updateForm.text,
        backgroundColor: this.updateForm.backgroundColor,
        start: this.updateForm.start,
        end: this.updateForm.end,
      };
      let index = this.calendarOptions.events.findIndex(e => e.id === oldData.id);
      this.calendarOptions.events.splice(index, 1, oldData)
      console.log("提交：", this.calendarOptions.events);
      this.dialogVisible = false
    },
    // 时间优化
    reloadDateTime(s, e) {
      // 时间处理
      let start = moment(s).format('YYYY-MM-DD HH:mm:ss');
      let end = moment(e).format('YYYY-MM-DD HH:mm:ss');

      // // 判断是否为时间精度
      if (s.length <= 10) {
        // 不精确到时分秒
        start = moment(s).format('YYYY-MM-DD HH:mm:ss').replace(" 00:00:00", "");
        end = moment(e).format('YYYY-MM-DD HH:mm:ss').replace(" 00:00:00", "");
      } else {
        // 有时分秒
        start = moment(s).format('YYYY-MM-DD HH:mm:ss');
        end = moment(e).format('YYYY-MM-DD HH:mm:ss');
      }
      return [start, end];
    }
  }
}
</script>

<style scoped>

/deep/ .fc .fc-popover {
  z-index: 1999 !important;
}

/deep/ .fc-h-event {
  border: none !important;
  padding: 1px;
  box-sizing: border-box;
}

/deep/ .fc-v-event{
  border: none;
}

.item {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: #318DDE;
  border-radius: 50%;
  margin: 0 5px;
}

.item-title {
  width: 161px;
  white-space: normal;
  overflow: auto;
  table-layout: fixed;
  word-break: break-all;
  height: auto;
  display: inline-block;
}
</style>
