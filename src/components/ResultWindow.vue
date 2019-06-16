<template>
    <div style="height:100%">
        <v-card style="height:100%">
          <v-card-title>
            <div class="headline">响应</div>
          </v-card-title>
          <v-container align-center>
            <div>
              <h2>响应头：</h2>
              <pre>
{{ resHeader }}
              </pre>
            </div>
            <div>
              <h2>响应体：
              <v-btn @click="showRawText = !showRawText" flat>显示原文</v-btn>
              <v-btn flat
                     v-clipboard:copy="resBody"
                     v-clipboard:success="onCopy">复制</v-btn>
              </h2>
              <json-viewer :value="JSON.parse(resBody)" expend-depth="5"></json-viewer>
              <p v-if="showRawText">{{ resBody }}</p>
            </div>
            <div>
              <h2>耗时：<span>{{ time }}</span></h2>
            </div>
            <div>
              <h2>状态码：<span>{{ statusCode }}</span></h2>
            </div>
          </v-container>
        </v-card>
    </div>
</template>

<script>
export default {
  name: 'ResultWindow',
  data () {
    return {
      window: window,
      showRawText: false,
      resBody: '{}',
      resHeader: '',
      statusCode: '',
      time: ''
    }
  },
  methods: {
    giveData: function (res) {
      console.log(res)
      this.resBody = res.body.content === null ? '' : res.body.content
      this.resHeader = res.body.headers
      this.statusCode = res.body.statusCode
    },
    giveTime: function (ms) {
      this.time = ms + 'ms'
    },
    onCopy: function () {
      alert('复制成功')
    }
  }
}
</script>
