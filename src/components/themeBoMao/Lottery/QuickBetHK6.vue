<template lang="pug">
.modal
  .filter-bar
    table.filter-left
      tbody
        tr(v-for="i in 10")
          template(v-for="j in 5")
            td(v-if="list[i-1+(j-1)*10]" :key="list[i-1+(j-1)*10].val" :class="getCls(list[i-1+(j-1)*10])" @click="toggleSelect(list[i-1+(j-1)*10])") {{renderVal(list[i-1+(j-1)*10])}}
    .filter-right
      Tabs(v-model="tabIndex")
        TabPane(v-for="item in ['大小单双', '色波', '生肖', '头尾数']", :key="item", :label="item")
      CheckboxGroup(v-model="filterKeys" @on-change="filterKeyChange")
        table
          tbody
            //- 公用
            tr(v-for="(child, child_idx) in commonLabel", :key="'common' + child_idx")
              td
                Checkbox(v-for="(item, item_idx) in child", :key="item.value", :label="item.value")
                  span.label {{item.label}}
            //- 大小单双
            template(v-if="tabIndex == 0")
              tr(v-for="(child, child_idx) in dxdsLabel", :key="'dxds' + child_idx")
                td
                  Checkbox(v-for="(item, item_idx) in child", :key="item.value", :label="item.value")
                    span.label {{item.label}}
            //- 色波
            template(v-if="tabIndex == 1")
              tr(v-for="(child, child_idx) in sbLabel", :key="'sb' + child_idx")
                td
                  Checkbox(v-for="(item, item_idx) in child", :key="item.value", :label="item.value")
                    span.label {{item.label}}
            //- 生肖
            template(v-if="tabIndex == 2")
              tr(v-for="(child, child_idx) in sxLabel", :key="'sx' + child_idx")
                td
                  Checkbox(v-for="(item, item_idx) in child", :key="item.value", :label="item.value")
                    span.label {{item.label}}
            //- 头尾数
            template(v-if="tabIndex == 3")
              tr(v-for="(child, child_idx) in twsLabel", :key="'tws' + child_idx")
                td
                  Checkbox(v-for="(item, item_idx) in child", :key="item.value", :label="item.value")
                    span.label {{item.label}}
  .modal-footer
    Button(type="text" size="large" @click="cancel" style="margin-right: 10px;") 取消
    Button(type="primary" size="large" @click="submit") 添加注单
</template>

<script>
import TWELVE from "utils/lottery/hk6_12";
import LABELS from "utils/hk6FilterLabel";

export default {
  name: "QuickBetHK6",
  data() {
    return {
      list: [],
      tabIndex: 0,
      filterKeys: [],
      tempFilterKeys: [], // 用于判断选中还是取消
      // labels
      commonLabel: LABELS.common,
      dxdsLabel: LABELS.dxds,
      sbLabel: LABELS.sb,
      sxLabel: LABELS.sx,
      twsLabel: LABELS.tws
    };
  },
  created() {
    const { getHK6Color } = this.$root;
    let ary = Array.apply(null, { length: 49 }).map((n, i) => {
      let val = i + 1;
      let obj = getHK6Color(val);
      obj.val = ("0" + obj.val).substr(-2);
      obj.selected = 0;
      return obj;
    });
    ary.push({
      sb: "",
      val: "",
      selected: 0
    });
    this.list = ary;
  },
  methods: {
    initState() {
      this.filterKeys = [];
      this.tempFilterKeys = [];
      this.filterEmptyChange();
    },
    getCls(item) {
      let cls = {
        color: `ui-${item.sb}`,
        active: item.selected ? "ui-active" : ""
      };
      return [cls.color, cls.active];
    },
    // 页面渲染的数据
    renderVal(obj) {
      return obj.val != "" ? +obj.val : "";
    },
    // 点击号码
    toggleSelect(item) {
      if (item.val == "") return;
      item.selected = !item.selected;
    },
    filterEmptyChange() {
      this.filterKeys = [];
      this.tempFilterKeys = [];
      this.list.forEach(item => {
        item.selected = 0;
      });
    },
    filterKeyChange(value) {
      const beoferLen = this.tempFilterKeys.length;
      const curLen = value.length;
      const state = curLen > beoferLen;
      let key;
      if (state) {
        // 选中
        key = value[curLen - 1];
      } else {
        // 撤销
        let after = new Set(value);
        let _key = this.tempFilterKeys.filter(key => !after.has(key));
        key = _key[0];
      }

      let { list } = this;

      // 反向 && 全删
      if (/(reverse|empty)/.test(key)) {
        if (key === "reverse") {
          list.forEach(item => {
            if (!item.val) {
              item.selected = 0;
              return;
            }
            item.selected = !item.selected;
          });
        }
        if (key === "empty") {
          list.forEach(item => {
            item.selected = 0;
          });
        }
        let keyValue = state ? key : "";
        this.filterKeys = [keyValue];
        this.tempFilterKeys = [keyValue];
        return;
      }

      // 最后一个key是不是 reverse || empty
      let last_idx = this.filterKeys.findIndex(key =>
        /(reverse|empty)/.test(key)
      );
      // 存在 reverse || empty ，移除
      if (last_idx > -1) {
        this.filterKeys.splice(last_idx, 1);
        this.tempFilterKeys = this.filterKeys;
      } else {
        this.tempFilterKeys = value; // 重新赋值
      }

      let twelve = TWELVE[0]; // TWELVE被套上[]的数组
      // 生肖
      let match12 = key.match(/^anm(\d{2})$/);
      if (match12) {
        let idx = match12[1] - 1;
        if (Number.isNaN(idx)) return;
        let set = new Set(twelve[idx].summary);
        list.forEach(item => {
          if (set.has(item.val)) item.selected = state;
        });
        return;
      }
      // 头尾数
      let match_ts = key.match(/^(t|s)d(\d)$/);
      if (match_ts) {
        let [a, b, c] = match_ts; // ["sd6", "s", "6", index: 0, input: "sd6", groups: undefined]
        let index = b === "t" ? 0 : 1;
        let method = ['indexOf', 'lastIndexOf'][index];
        list.forEach(item => {
          if (item.val[method](c) === index) item.selected = state;
        });
        return;
      }

      switch (key) {
        case "reverse": // 反向
          list.forEach(item => {
            if (!item.val) {
              item.selected = 0;
              return;
            }
            item.selected = !item.selected;
          });
          break;
        case "empty": // 全删
          list.forEach(item => {
            item.selected = 0;
          });
          break;
        case "td": // 合大
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            const num = item.val;
            let [a, b] = num;
            a = parseInt(a, 10);
            b = parseInt(b, 10);
            if (a + b >= 7) item.selected = state;
          });
          break;
        case "ts": // 合小
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            const num = item.val;
            let [a, b] = num;
            a = parseInt(a, 10);
            b = parseInt(b, 10);
            if (a + b <= 6) item.selected = state;
          });
          break;
        case "to": // 合单
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            const num = item.val;
            let [a, b] = num;
            a = parseInt(a, 10);
            b = parseInt(b, 10);
            if ((a + b) % 2 !== 0) item.selected = state;
          });
          break;
        case "te": // 合双
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            const num = item.val;
            let [a, b] = num;
            a = parseInt(a, 10);
            b = parseInt(b, 10);
            if ((a + b) % 2 === 0) item.selected = state;
          });
          break;
        case "dd": // 大单
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            if (item.val >= 25 && item.val % 2 !== 0) {
              item.selected = state;
            }
          });
          break;
        case "ds": // 大双
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            if (item.val >= 25 && item.val % 2 === 0) {
              item.selected = state;
            }
          });
          break;
        case "so": // 小单
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            if (item.val < 25 && item.val % 2 !== 0) {
              item.selected = state;
            }
          });
          break;
        case "se": // 小双
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            if (item.val < 25 && item.val % 2 === 0) {
              item.selected = state;
            }
          });
          break;
        case "sd": // 尾大
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            const num = item.val;
            let [a, b] = num;
            if (b >= 5) item.selected = state;
          });
          break;
        case "ss": // 尾小
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            const num = item.val;
            let [a, b] = num;
            if (b < 5) item.selected = state;
          });
          break;
        /**
         * 大小单双
         */
        case "d": // 大
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            if (item.val >= 25) item.selected = state;
          });
          break;
        case "s": // 小
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            if (item.val < 25) item.selected = state;
          });
          break;
        case "o": // 单
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            if (item.val % 2 !== 0) item.selected = state;
          });
          break;
        case "e": // 双
          list.forEach(item => {
            if (!item.val || item.val == 49) {
              item.selected = 0;
              return;
            }
            if (item.val % 2 === 0) item.selected = state;
          });
          break;
        /**
         * 色波
         */
        case "r": // 红
          list.forEach(item => {
            if (item.sb === "red") item.selected = state;
          });
          break;
        case "g": // 绿
          list.forEach(item => {
            if (item.sb === "green") item.selected = state;
          });
          break;
        case "b": // 蓝
          list.forEach(item => {
            if (item.sb === "blue") item.selected = state;
          });
          break;
        case "rb": // 红大
          list.forEach(item => {
            if (item.sb === "red" && item.val >= 25) item.selected = state;
          });
          break;
        case "rs": // 红小
          list.forEach(item => {
            if (item.sb === "red" && item.val < 25) item.selected = state;
          });
          break;
        case "ro": // 红单
          list.forEach(item => {
            if (item.sb === "red" && item.val % 2 !== 0) item.selected = state;
          });
          break;
        case "re": // 红双
          list.forEach(item => {
            if (item.sb === "red" && item.val % 2 === 0) item.selected = state;
          });
          break;
        case "bb": // 蓝大
          list.forEach(item => {
            if (item.sb === "blue" && item.val >= 25) item.selected = state;
          });
          break;
        case "bs": // 蓝小
          list.forEach(item => {
            if (item.sb === "blue" && item.val < 25) item.selected = state;
          });
          break;
        case "bo": // 蓝单
          list.forEach(item => {
            if (item.sb === "blue" && item.val % 2 !== 0) item.selected = state;
          });
          break;
        case "be": // 蓝双
          list.forEach(item => {
            if (item.sb === "blue" && item.val % 2 === 0) item.selected = state;
          });
          break;
        case "gb": // 绿大
          list.forEach(item => {
            if (item.sb === "green" && item.val >= 25) item.selected = state;
          });
          break;
        case "gs": // 绿小
          list.forEach(item => {
            if (item.sb === "green" && item.val < 25) item.selected = state;
          });
          break;
        case "go": // 绿单
          list.forEach(item => {
            if (item.sb === "green" && item.val % 2 !== 0)
              item.selected = state;
          });
          break;
        case "ge": // 绿双
          list.forEach(item => {
            if (item.sb === "green" && item.val % 2 === 0)
              item.selected = state;
          });
          break;
        /**
         * 生肖
         */
        case "front_anm": // 前肖
          let { front_anm = [] } = this;
          if (!front_anm.length) {
            twelve.forEach((item, idx) => {
              if (idx <= 5) front_anm.push(...item.summary);
            });
            this.front_anm = front_anm;
          }
          let front_anmSet = new Set(front_anm);
          list.forEach(item => {
            if (front_anmSet.has(item.val)) item.selected = state;
          });
          break;
        case "back_anm": // 后肖
          let { back_anm = [] } = this;
          if (!back_anm.length) {
            twelve.forEach((item, idx) => {
              if (idx > 5) back_anm.push(...item.summary);
            });
            this.back_anm = back_anm;
          }
          let back_anmSet = new Set(back_anm);
          list.forEach(item => {
            if (back_anmSet.has(item.val)) item.selected = state;
          });
          break;
        case "sky_anm": // 天肖
          let { sky_anm = [] } = this;
          if (!sky_anm.length) {
            let content = "牛兔龙马猴猪";
            twelve.forEach((item, idx) => {
              if (~content.indexOf(item.value)) sky_anm.push(...item.summary);
            });
            this.sky_anm = sky_anm;
          }
          let sky_anmSet = new Set(sky_anm);
          list.forEach(item => {
            if (sky_anmSet.has(item.val)) item.selected = state;
          });
          break;
        case "land_anm": // 地肖
          let { land_anm = [] } = this;
          if (!land_anm.length) {
            let content = "鼠虎羊蛇鸡狗";
            twelve.forEach((item, idx) => {
              if (~content.indexOf(item.value)) land_anm.push(...item.summary);
            });
            this.land_anm = land_anm;
          }
          let land_anmSet = new Set(land_anm);
          list.forEach(item => {
            if (land_anmSet.has(item.val)) item.selected = state;
          });
          break;
        case "beast_anm": // 野兽
          let { beast_anm = [] } = this;
          if (!beast_anm.length) {
            let content = "鼠虎兔龙蛇猴";
            twelve.forEach((item, idx) => {
              if (~content.indexOf(item.value)) beast_anm.push(...item.summary);
            });
            this.beast_anm = beast_anm;
          }
          let beast_anmSet = new Set(beast_anm);
          list.forEach(item => {
            if (beast_anmSet.has(item.val)) item.selected = state;
          });
          break;
        case "poultry_anm": // 家禽
          let { poultry_anm = [] } = this;
          if (!poultry_anm.length) {
            let content = "牛马羊鸡狗猪";
            twelve.forEach((item, idx) => {
              if (~content.indexOf(item.value))
                poultry_anm.push(...item.summary);
            });
            this.poultry_anm = poultry_anm;
          }
          let poultry_anmSet = new Set(poultry_anm);
          list.forEach(item => {
            if (poultry_anmSet.has(item.val)) item.selected = state;
          });
          break;
        default:
          break;
      }
    },
    cancel() {
      this.tabIndex = 0;
      this.initState();
      this.$emit("cancel");
    },
    submit() {
      let list = this.list.filter(item => item.selected);
      list = list.map(item => +item.val);
      this.$emit("submit", list);
      this.tabIndex = 0;
      this.initState();
    }
  },
  watch: {
    tabIndex: "initState"
  }
};
</script>

<style lang="scss" scoped>
$border: 1px solid #ddd;

.filter-bar {
  @extend %clearfix;
}

.filter-left {
  float: left;
  width: 35%;
  border-top: $border;
  border-right: $border;
  td {
    border-bottom: $border;
    border-left: $border;
    padding: 3px;
    text-align: center;
    font-weight: 700;
    cursor: pointer;
  }
}
.filter-right {
  float: left;
  padding-left: 10px;
}
.ui-red {
  color: $ball-red;
}
.ui-green {
  color: $ball-green;
}
.ui-blue {
  color: $ball-blue;
}
.ui-active {
  background: yellow;
}
.label {
  display: inline-block;
  width: 30px;
}
.modal-footer {
  margin: 16px -16px 0;
  border-top: 1px solid #e9eaec;
  padding: 12px 18px 0 18px;
  text-align: right;
}
</style>
