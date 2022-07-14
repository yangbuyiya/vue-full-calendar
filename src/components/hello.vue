<template>
  <div>
    <full-calendar v-if="show"
                   ref="calendar"
                   :config="config"
                   :events="events"

    ></full-calendar>
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
import {FullCalendar} from 'vue-full-calendar'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import tippy from "tippy.js";
import "fullcalendar/dist/fullcalendar.css";
import moment from 'moment'

export default {
  name: 'hello',
  components: {FullCalendar},
  data() {
    return {
      updateForm: {},
      config: {
        plugins: [
          // 加载插件，V5采用插件模块方式加入
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
        ],
        handleWindowResize: true, //随浏览器窗口变化
        // initialView: 'dayGridPlugin', // 初始化插件显示
        locale: zhCnLocale,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,list'
        },
        buttonText: {today: "今天", month: "月", week: "周", day: "日", list: "日程"},
        defaultView: "month", //显示默认视图
        weekMode: 'liquid', //在月视图里显示周的模式，因为每月周数可能不同，所以月视图高度不一定。fixed：固定显示6周高，日历高度保持不变liquid：不固定周数，高度随周数变化variable：不固定周数，但高度固定
        weekNumbers: true, //是否在视图左边显示这是第多少周，默认false
        height: 'auto',
        timeFormat: 'HH:mm',
        navLinks: true,       // can click day/week names to navigate views
        eventLimit: 5,        // 限制一天中显示的事件数，默认false
        allDayText: '排班',   // 日历上显示全天的文本
        selectable: true,     // 允许用户通过单击或拖动选择日历中的对象，包括天和时间。
        selectHelper: true,  // 当点击或拖动选择时间时，显示默认加载的提示信息，该属性只在周/天视图里可用。
        unselectAuto: true,   // 当点击页面日历以外的位置时，自动取消当前的选中状态。
        eventBackgroundColor: '#3a87ad',    // 设置日程事件的背景色
        select: this.selectHandler, // 点击空白区域出触发
        eventClick: this.eventClick, // 点击日程触发
        events: this.eventsMethod, // 监听下一页 上一页按钮
        eventMouseEnter: this.handleEventMouseEnter, // 用户将鼠标悬停在事件上时触发
        removeEvents: this.removeEvents, // 删除
        dragScroll: true, //是否在拖拽时自动移动容器，默认true
      },
      events: [],
      show: false,
      dialogVisible: false,
      // 选中的参数
      selectFrom: {
        start: '',
        end: '',
        allDay: null
      },
      count: 11,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.show = true
    })
  },
  watch: {
    events: {
      handler(n) {
        console.log(n);
      },
      deep: true
    }
  },
  methods: {
    // 选中白色区域的时候 (新增)
    selectHandler(start, end, allDay) {

      console.log(start);
      console.log(end);
      console.log(allDay);

      // let startFormat = moment(start).format('YYYY-MM-DD HH:MM:SS');
      // let endFormat = moment(end).format('YYYY-MM-DD HH:MM:SS');
      // console.log('from === ' + startFormat + '====to === ' + endFormat + '====allDay====');
      // console.log(allDay);
      // this.count = this.count + 1
      // //添加日历
      // let json = {
      //   id: this.count,
      //   title: "张三" + ' - ' + "夜班" + this.count,
      //   text: "张三",
      //   allDay: allDay,
      //   backgroundColor: "#3a87ad",
      //   start: start.format('YYYY-MM-DD HH:MM:SS'),
      //   end: end.format('YYYY-MM-DD HH:MM:SS')
      // };
      // this.events.push(json);

    },
    // 更新事件数据并且保存数据库
    eventClick(calEvent) {
      // 调用弹出
      this.dialogVisible = true
      this.updateForm = calEvent
    },
    // 监听上一页下一页按钮 拿数据
    eventsMethod(start, end, timezone, callback) {
      let startFormat = moment(start).format('YYYY-MM-DD');
      let endFormat = moment(end).format('YYYY-MM-DD');
      let events = this.loopMonthDay(startFormat, endFormat);
      // 传递给事件参数
      this.events = events
      //将整理好格式的数组放在回调中执行，这样在切换月份的时候就会自动掉接口获取
      callback && callback(events);
    },
    // 根据参数获取对应月份日期的事件数据
    loopMonthDay(start, end) {
      // alert("切换月份数据清空，重新拉取对应数据")
      console.log("接口调用：", start, end);
      let s = "2022-07-23";
      let e = "2022-07-26"; // == 25
      // 结束时间组件会-1
      return [
        {
          id: 0,
          title: '事件内容',  // 事件内容
          start: s, // 事件开始时间
          end: e,   // 事件结束时间
          color: 'red'       // 事件的显示颜色
        }
      ];
    },
    // 用户将鼠标悬停在事件上时触发,这里数据做了类型判断，不同的类型数据页面悬浮框显示不用的内容
    handleEventMouseEnter(info) {
      console.log(info, 'yyyy')
      // let col = info.event.borderColor
      let eve = info.event._def.extendedProps
      // let category = info.event._def.extendedProps.category

      tippy(info.el, {
        // content:"<div style='width: 280px;background-color:#FAFAFA;padding:5px;font-size:14px;z-index:99999'>" +
        //           "<div style='color: #666666;overflow: hidden;'><span style='display:inline-block;width:6px;height:6px;background-color:#318DDE;border-radius:50%;margin:0 5px;'></span>会议名称：" + info.event.title+"</div>" +
        //           "<div style='color: #666666;overflow: hidden;'><span style='display:inline-block;width:6px;height:6px;background-color:#318DDE;border-radius:50%;margin:0 5px;'></span>会议类型："+eve.type+"</div>" +
        //           "<div style='color: #666666;overflow: hidden;'><span style='display:inline-block;width:6px;height:6px;background-color:#318DDE;border-radius:50%;margin:0 5px;'></span>会议时间："+eve.times+"</div>" +
        //           "<div style='color: #666666;overflow: hidden;'><span style='display:inline-block;width:6px;height:6px;background-color:#318DDE;border-radius:50%;margin:0 5px;'></span>会议状态："+eve.status+"</div>" +
        //         "</div>",
        content: `<div style='width: 260px;background-color:#FAFAFA;padding:5px;font-size:14px;z-index:99999;'>
                  <div style='display:flex;color: #666666;overflow: hidden;' class="${eve.category == 1 ? 'hidden' : ''}">
                    <div><span style='display:inline-block;width:6px;height:6px;background-color:#318DDE;border-radius:50%;margin:0 5px;'></span>会议名称： </div>
                    <div style="width:161px;white-space:normal;overflow: auto;table-layout:fixed; word-break: break-all; height:auto;display:inner-block">${info.event.title}</div>
                  </div>
                  <div style='color: #666666;overflow: hidden;' class="${eve.category == 0 ? 'hidden' : ''}"><span style='display:inline-block;width:6px;height:6px;background-color:#318DDE;border-radius:50%;margin:0 5px;'></span>姓名：${info.event.title}</div>
                </div>`,
        theme: 'light', //主题选取
        // trigger: 'click', //触发类型
        interactive: true, //可交互的
        placement: 'top-start', //悬浮框位置
        allowHTML: true, //是否允许html文本
        zIndex: 99999,
      })
    },
    handleClose(done) {
      done();
    },
    // 提交
    submit() {
      // 拿到当前点击的(更改的)
      // let oldData = this.updateForm;
      let oldData = {
        id: this.updateForm.id,
        title: this.updateForm.title,
        text: this.updateForm.text,
        backgroundColor: this.updateForm.backgroundColor,
        start: this.updateForm.start,
        end: this.updateForm.end,
      };
      let index = this.events.findIndex(e => e.id === oldData.id);
      this.events.splice(index, 1, oldData)
      console.log("提交：", this.events);
      this.dialogVisible = false
    },

  }
}
</script>

<style scoped>

</style>
