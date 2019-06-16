<template>
  <div id="app">
    <v-app style="overflow:auto; height:100%;width:100%">
    <v-container fluid grid-list-xl>
        <v-layout justify-center>
          <!-- left 请求表单 -->
          <v-flex xs6>
            <api-test-form @callGiveData="callGiveData" @callGiveTime="callGiveTime"></api-test-form>
          </v-flex>
          <!-- 请求结果展示 -->
          <v-flex xs6>
            <result-window ref="resultWindow"></result-window>
          </v-flex>
        </v-layout>
    </v-container>
    </v-app>
  </div>
</template>

<script>
import ApiTestForm from './components/ApiTestForm'
import ResultWindow from './components/ResultWindow'

export default {
  name: 'App',
  components: {
    ApiTestForm,
    ResultWindow
  },
  data () {
    return {
      res: {
        header: {},
        body: {}
      }
    }
  },
  methods: {
    callGiveData: function (res) {
      this.$refs.resultWindow.giveData(res)
    },
    callGiveTime: function (ms) {
      this.$refs.resultWindow.giveTime(ms)
    }
  }
}
</script>

<style scoped>
#app {
  background-color: white;
  width: 100%
}
</style>
