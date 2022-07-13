<template>
  <div>
    <full-calendar v-if="show"
                   ref="calendar"
                   :config="config"
                   :events="events"
    ></full-calendar>
    <!--  删除 更新  -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">


      <div>

        <el-form class="info" ref="updateForm" label-position="left" :model="updateForm" label-width="150px"
                 size="mini">

          <el-form-item label="活动名称">
            <el-input v-model="selectFrom.name"></el-input>
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
import "fullcalendar/dist/fullcalendar.css";
import moment from 'moment'

export default {
  name: 'hello',
  components: {FullCalendar},
  data() {
    return {
      updateForm: {},

      config: {

        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,list'
        },
        buttonText: {today: "今天", month: "月", week: "周", day: "日", list: "日程"},
        locale: "zh-cn",
        defaultView: "month", //显示默认视图
        weekMode: 'liquid', //在月视图里显示周的模式，因为每月周数可能不同，所以月视图高度不一定。fixed：固定显示6周高，日历高度保持不变liquid：不固定周数，高度随周数变化variable：不固定周数，但高度固定
        weekNumbers: true, //是否在视图左边显示这是第多少周，默认false
        // height: 'auto',
        weekNumbers:false,//是否在日历中显示周次(一年中的第几周)，如果设置为true，则会在月视图的左侧、周视图和日视图的左上角显示周数。
        weekNumberCalculation:'iso',//周次的显示格式。
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
        dragOpacity: 0.2,    //拖拽时不透明度，0.0~1.0之间，数字越小越透明
        dragScroll: true, //是否在拖拽时自动移动容器，默认true
      },

      // 存储数据的
      events: [],
      show: false,
      dialogVisible: false,
      // 选中的参数
      selectFrom: {
        start: '',
        end: '',
        allDay: null
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.show = true
    })
  },
  watch: {
    events: {
      handler(n, o) {
        console.log(n);
        console.log(o);
      },
      deep: true
    }
  },
  methods: {
    // 选中白色区域的时候 (新增)
    selectHandler(start, end, allDay) {
      let startFormat = moment(start).format('YYYY-MM-DD');
      let endFormat = moment(end).format('YYYY-MM-DD');
      console.log('from === ' + startFormat + '====to === ' + endFormat + '====allDay====');
      console.log(allDay);

      //添加日历
      let json = {
        title: "新增",
        text: "...",
        allDay: allDay,
        backgroundColor: "#3a87ad",
        start: start.format('YYYY-MM-DD'),
        end: end.format('YYYY-MM-DD')
      };
      this.events.push(json);

      // 调用弹出
      // this.dialogVisible = true
      // this.selectFrom = {
      //   start: start.format('YYYY-MM-DD'),
      //   end: end.format('YYYY-MM-DD'),
      //   allDay: null
      // }
    },
    // 更新事件数据并且保存数据库
    eventClick(calEvent, jsEvent, view) {
      console.log(calEvent);

      this.events.push(calEvent,)

      console.log(jsEvent);
      console.log(view);
      // console.log('calEvent === ' + calEvent + '====jsEvent === ' + jsEvent + '====view====' + view);
    },

    // 监听上一页下一页按钮 拿数据
    eventsMethod(start, end, timezone, callback) {

      let startFormat = moment(start).format('YYYY-MM-DD');
      let endFormat = moment(end).format('YYYY-MM-DD');
      console.log('pre === ' + startFormat + '==== end === ' + endFormat + '====allDay====');


      let events = this.loopMonthDay(1, 2);
      // 传递给事件参数
      this.events = events
      //将整理好格式的数组放在回调中执行，这样在切换月份的时候就会自动掉接口获取
      callback(events);
    },

    // 根据参数获取对应月份日期的事件数据
    loopMonthDay(start, end) {
      console.log(start, end);
      return [
        {
          title: '我是上一页下一页的',  // 事件内容
          start: '2022-07-23', // 事件开始时间
          end: '2022-07-26',   // 事件结束时间
          color: 'green'       // 事件的显示颜色
        }
      ];
    },

    handleClose(done) {
      done();
    },
    // 提交
    submit() {

    },
    /**
     * 时间处理函数
     * */
    gettime(data) {
      data = new Date(data);
      return data.getFullYear() + '-' +
          this.checkTime(data.getMonth() + 1) + '-' +
          this.checkTime(data.getDate()) + ' ' +
          this.checkTime(data.getHours()) + ':' +
          this.checkTime(data.getMinutes()) + ':' +
          this.checkTime(data.getSeconds())
    },

    /**
     * 时间处理
     * 如果时间小于10 ，则再前面加一个'0'
     * */
    checkTime(i) {
      if (i < 10) {
        i = "0" + i
      }
      return i;
    },

  }
}
</script>

<style scoped>

</style>
