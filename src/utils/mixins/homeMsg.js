import { accountApi } from '@/api';

const mixins = {
  data() {
    return {
      loading: false,
      tid: null,

      // 公告
      modal: false,
      msgList: [],
      msgIndex: 0,
      remember: false, // 保存读取状态
    };
  },
  computed: {
    isRegLogin() {
      return /(login|register)/i.test(this.$route.path);
    },
    curMsg() {
      return this.msgList[this.msgIndex] || {};
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.refreshInfo();
    },
    refreshInfo() {
      this.$store.dispatch('accountInfo').then(data => {
        if (data === 'visitor' || data === '') return;
        this.fetchMsg();
      });
    },
    refresh() {
      this.loading = true;
      clearTimeout(this.tid);
      this.tid = setTimeout(() => {
        this.refreshInfo();
        this.loading = false;
      }, 200);
    },
    logout() {
      this.$store.dispatch('logout', { isReload: true });
    },
    fetchMsg() {
      accountApi.userMsg().then(data => {
        if (data.code != 0) return;
        this.msgList = data.list;
        if (this.msgList.length) this.modal = true;
      });
    },
    close() {
      if (this.remember) {
        accountApi.markRead({ id: this.curMsg.id });
      }
      if (this.msgIndex < this.msgList.length - 1) {
        this.msgIndex++;
        this.remember = false;
      } else {
        // 初始化
        this.msgIndex = 0;
        this.remember = false;
        this.msgList.splice(0);
        this.modal = false;
      }
    },
  },
  watch: {
    // 投注状态改变，更新用户财富数据
    betState: 'refreshInfo',
    $route(to) {
      if (/home/.test(to.name)) this.init();
    },
  },
};

export default mixins;
