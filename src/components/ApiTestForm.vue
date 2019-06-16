<template>
  <v-card style="min-height:500px;height:100%">
    <v-card-title>
      <div>
        <div class="headline">
          测试任务 &nbsp;&nbsp;&nbsp;
          <v-btn @click="send">发送请求</v-btn>
          <v-dialog v-model="diyDialog" persistent max-width="600">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on" @click="initUserDefinedInterface">添加自定义接口</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ this.userDefinedInterface.name === '' ? '新增自定义接口' : this.userDefinedInterface.name }}</span>
              </v-card-title>
              <v-card-text>
              <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6>
                  <v-text-field label="接口名称" v-model="userDefinedInterface.name"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field label="url" placeholder="https://api-{reigon}.cticloud.cn/..." v-model="userDefinedInterface.apiUrl"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout wrap v-for="(item, i) in userDefinedInterface.params" :key="i">
                <v-flex xs5>
                  <v-text-field label="参数名" v-model="item.title"></v-text-field>
                </v-flex>
                <v-flex xs5>
                  <v-text-field label="参数值" v-model="item.defaultValue" @keyup.enter="insertUserDefinedParams(i)"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-btn @click="removeUserDefinedParams" flat color="red"><v-icon>remove_circle</v-icon></v-btn>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12>
                  <v-btn @click="addUserDefinedParams">添加参数</v-btn>
                </v-flex>
              </v-layout>
              </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="diyDialog = false">取消</v-btn>
                <v-btn color="blue darken-1" flat @click="saveUserDefinedInterface">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn color="deep-orange accent-2" @click="removeUserDefinedInterfaces">删除自定义接口</v-btn>
        </div>
      </div>
      <v-container fluid grid-list-xl>
        <v-layout wrap align-center>
          <v-flex xs12 sm6 d-flex>
            <v-select no-data-text="暂无数据" label="选择模块" :items="modules" @change="getInterfaces" v-model="moduleSelected"></v-select>
          </v-flex>
          <v-flex xs12 sm6 d-flex>
            <v-select :items="interfaces"  no-data-text="暂无数据" label="选择接口" @change="getInteface" v-model="interfaceSelected"></v-select>
          </v-flex>
          </v-layout>
            <v-layout wrap align-center>
              <v-flex xs12 d-flex>
                <v-radio-group row v-model="region">
                  <v-radio label="阿里1" value="1"></v-radio>
                  <v-radio label="AWS2" value="2"></v-radio>
                  <v-radio label="AWS6" value="6"></v-radio>
                  <v-radio label="测试平台" value="test-2"></v-radio>
                  <v-radio label="dev" value="dev"></v-radio>
                </v-radio-group>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12 d-flex>
                <v-text-field label="请求地址" disabled
                              :value="this.interface.apiUrl === undefined ? '' : decodeURI(this.interface.apiUrl).replace('{region}', this.region).replace('{version}', 'v10')"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap align-center>
              <v-flex xs12 sm6 d-flex>
                <v-select :items="[{ text: '使用呼叫中心编号', value: '2' }, { text: '使用部门编号校验', value: '1' }]"  label="选择校验方式" v-model="requestData.validateType"></v-select>
              </v-flex>
              <v-flex xs12 sm6 d-flex v-if="requestData.validateType === '2'">
                <v-text-field label="呼叫中心编号(enterpriseId)" v-model="requestData.enterpriseId" @change="makeSign"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 d-flex v-if="requestData.validateType === '1'">
                <v-text-field label="部门编号(departmentId)" v-model="requestData.departmentId" @change="makeSign"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap align-center>
              <v-flex xs12 sm6 d-flex>
                <v-text-field label="时间戳(30分钟后自动切换)" v-model="requestData.timestamp" disabled></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 d-flex>
                <v-text-field label="token" v-model="requestData.token" @change="makeSign"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap align-center>
              <v-flex>
                <v-text-field label="sign" v-model="requestData.sign" :hint="signNotice"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap align-center v-for="(item, i) in this.interface.params" :key="i">
              <!-- 表明是动态参数 -->
                <v-flex v-if="dynaParam(item.title)">
                  <v-text-field :label="'设置动态参数名(' + item.title + ')'" v-model="dynaParams[i].title"></v-text-field>
                </v-flex>
                <v-flex v-if="dynaParam(item.title)">
                  <v-text-field :label="'设置对应参数值(' + dynaParams[i].title + ')'" v-model="dynaParams[i].value"></v-text-field>
                </v-flex>
                <v-flex xs12 v-if="!dynaParam(item.title)">
                  <v-text-field :label="item.name + '(' + item.title + ')'"
                                :placeholder="item.defaultValue"
                                :hint="item.description"
                                :required="item.optional" v-model="params[i]"></v-text-field>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card-title>
  </v-card>
</template>

<script>
import md5 from 'js-md5'
import { setInterval } from 'timers'
export default {
  name: 'ApiTestForm',
  data () {
    return {
      moduleSelected: '',
      interfaceSelected: '',
      modules: [ '权限验证', '员工数据管理' ],
      interfaces: [],
      interfacesDetail: new Map(),
      interface: {},
      region: 'test-2',
      requestData: {
        enterpriseId: '',
        departmentId: '',
        timestamp: parseInt((new Date()).getTime() / 1000),
        token: '',
        validateType: '2',
        sign: ''
      },
      signNotice: '',
      params: [],
      dynaParams: [],
      diyDialog: false,
      userDefinedInterfaces: {},
      userDefinedInterface: {
        apiUrl: '',
        name: '',
        params: []
      }
    }
  },
  methods: {
    getModules: function () {
      this.$http.get('http://localhost:8080/data/allModules').then(res => {
        this.modules = res.body
        this.modules.push('自定义')
      })
    },
    getInterfaces: function (module) {
      this.interfaces = []
      this.interfacesDetail = new Map()
      let that = this
      // 如果是自定义模块
      if (module === '自定义') {
        let storeIntefaces = sessionStorage.getItem('storeInterfaces')
        if (storeIntefaces !== null) {
          storeIntefaces = JSON.parse(storeIntefaces)
          storeIntefaces.forEach((item, i) => {
            this.interfaces.push(item.name)
            this.interfacesDetail.set(item.name, item)
          })
        }
        return
      }
      module = module === '员工数据管理' ? '员工管理' : module
      this.$http.get('http://localhost:8080/data/searchByModule?moduleName=' + module).then(res => {
        res.body.forEach((item, i) => {
          that.interfaces.push(item.name)
          that.interfacesDetail.set(item.name, item)
        })
      })
    },
    getInteface: function (fun) {
      this.interface = this.interfacesDetail.get(fun)
      this.params = new Array(this.interface.params.length)
      // 考虑到含有动态参数的情况
      this.dynaParams = new Array(this.interface.params.length)
      this.interface.params.forEach((param, i) => {
        this.params[i] = param.optional ? '' : param.defaultValue
        if (this.dynaParam(param.title)) {
          this.dynaParams[i] = { title: '', value: '' }
        }
      })
    },
    makeTimestamp: function () {
      this.timestamp = parseInt((new Date()).getTime() / 1000)
    },
    makeSign: function () {
      let id = ''
      if (this.requestData.validateType === '1') {
        if (this.requestData.departmentId === '') {
          this.signNotice = '部门编号不能为空'
          return
        }
        id = this.requestData.departmentId
      } else {
        if (this.requestData.enterpriseId === '') {
          this.signNotice = '呼叫中心编号不能为空'
          return
        }
        id = this.requestData.enterpriseId
      }
      if (this.requestData.token === '') {
        this.signNotice = 'token不能为空'
        return
      }
      this.requestData.sign = md5(id + this.requestData.timestamp + this.requestData.token)
    },
    dynaParam: function (title) {
      return title.indexOf('$') === 0
    },
    initUserDefinedInterface: function () {
      this.userDefinedInterface = {
        apiUrl: '',
        name: '',
        params: []
      }
    },
    removeUserDefinedInterfaces: function () {
      sessionStorage.removeItem('storeInterfaces')
      this.interfacesDetail = new Map()
    },
    addUserDefinedParams: function () {
      this.userDefinedInterface.params.push({ title: '', name: '', defaultValue: '', optional: false })
    },
    insertUserDefinedParams: function (i) {
      this.userDefinedInterface.params.splice(i + 1, 0, { title: '', name: '', defaultValue: '', optional: false })
    },
    removeUserDefinedParams: function () {
      this.userDefinedInterface.params.pop()
    },
    saveUserDefinedInterface: function () {
      // 接口名称是否设置？
      if (this.userDefinedInterface.name === '') {
        let count = sessionStorage.getItem('count')
        if (count === null) count = 1
        else ++count
        this.userDefinedInterface.name = '自定义接口' + count
        sessionStorage.setItem('count', count)
      }
      // step 1 向session中存储接口
      let storeInterfaces = sessionStorage.getItem('storeInterfaces')
      if (storeInterfaces === null) {
        storeInterfaces = []
      } else {
        storeInterfaces = JSON.parse(storeInterfaces)
      }
      storeInterfaces.push(this.userDefinedInterface)
      sessionStorage.setItem('storeInterfaces', JSON.stringify(storeInterfaces))
      // step 2 将级联菜单切换到自定义模块
      this.moduleSelected = '自定义'
      console.log(this.userDefinedInterface.name)
      storeInterfaces.forEach((item, i) => {
        this.interfaces.push(item.name)
        this.interfacesDetail.set(item.name, item)
      })
      this.interfaceSelected = this.userDefinedInterface.name
      // step 3 自定义参数更新到表单中
      this.interface = this.userDefinedInterface
      // step 4 关闭模态框
      this.diyDialog = false
    },
    send: function () {
      let url = decodeURI(this.interface.apiUrl).replace('{region}', this.region).replace('{version}', 'v10')
      let data = {}
      let func = []
      this.interface.params.forEach((param, i) => {
        func.push(param.title)
      })
      this.params.forEach((val, i) => {
        if (this.dynaParam(func[i])) {
          let kv = this.dynaParams[i]
          data[kv.title] = kv.value
        } else {
          data[func[i]] = val
        }
      })
      data['url'] = url
      data = Object.assign(data, this.requestData)
      let that = this
      let start = (new Date()).getTime()
      this.$http.post('http://localhost:8080/api/send', data).then(function (res) {
        that.$emit('callGiveData', res)
        console.log('shoot')
        that.$emit('callGiveTime', (new Date()).getTime() - start)
      }, function (res) {
        that.$emit('callGiveData', res)
        console.log('failed')
        that.$emit('callGiveTime', (new Date()).getTime() - start)
      })
    }
  },
  mounted () {
    this.getModules()
    setInterval(this.makeTimestamp, 1200 * 1000)
  }
}
</script>
