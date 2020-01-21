const exec = require('child_process').exec
const { CodeMaker } = require("codemaker")
const config = require("./model.config")
const baseUrl = `http://127.0.0.1:7001/api/v1/${config.name}`

let maker = new CodeMaker()
// 生成service 文件
console.log(`----生成 ${config.name}.service.js 开始----`)
maker.openFile(`${config.name}.service.js`)
maker.line(`'use strict'`)
maker.line(`

const U = require("../utils/util")
const Service = require("egg").Service

class ${config.modelName}Service extends Service {

    // 根据条件查询总条数
    async total (queryConditions){
        return await this.ctx.model.${config.modelName}.find(queryConditions).count()
    }

    async retrieve () {
        const { ctx } = this
        const condition = ctx.request.body.condition?ctx.request.body.condition:null
        const sort = ctx.request.body.sort?ctx.request.body.sort:null
        let queryConditions = {}
        for (const key in condition) {
            if (condition.hasOwnProperty(key)) {
                queryConditions[key] = {$regex:condition[key],$options:'$i'}
            }
        }
        const count = (ctx.request.body.pageNumber - 1) * ctx.request.body.pageSize
        const result = await ctx.model.${config.modelName}.find(queryConditions).limit(parseInt(ctx.request.body.pageSize)).skip(count).sort(sort)
        const total = await this.total(queryConditions)
        return U.pageHelper(result,total)
    }

    async retrieveById () {
        const { ctx } = this
        let result = null
        try {
            result = await ctx.model.${config.modelName}.findById(ctx.params.id)
        } catch (error) {
            result = error.message
        }
        return result
    }

    async create (){
        const { ctx } = this
        let result = null
        try {
            result = await ctx.model.${config.modelName}.create(ctx.request.body)
        } catch (error) {
            result = error.message
        }
        return result
    }

    async update () {
        const {ctx} = this
        let updateContent = {...ctx.request.body}
        let result = null
        try {
            result = await ctx.model.${config.modelName}.findByIdAndUpdate(ctx.params.id,updateContent)
        } catch (error) {
            result = error.message
        }
        return result
    }
    
    async delete () {
        const { ctx } = this
        let result = null
        try {
            result = await ctx.model.${config.modelName}.findByIdAndDelete(ctx.params.id)
        } catch (error) {
            result = error.message
        }
        return result
    }

}
module.exports = ${config.modelName}Service

`)
maker.closeFile(`${config.name}.service.js`)

console.log(`----生成 ${config.modelName}.service.js 结束----`)

// 生成controller文件
console.log(`----生成 ${config.name}.controller.js 开始----`)
maker.openFile(`${config.name}.controller.js`)
maker.line(`'use strict'`)
maker.line(`

const U = require('../utils/util')
const V = require("../utils/validate")
const Controller = require('egg').Controller;
class ${config.modelName}Controller extends Controller {

    // 查询${config.chname} -- 分页，模糊查询，排序
    async retrieve () {
        const { ctx } = this;
        // 参数校验
        const CUSTOM_VALIDATE = []
        const V_RESULT = U.validateParams(ctx.request.body, [V.pageSize, V.pageNumber, ...CUSTOM_VALIDATE])

        // 响应处理
        if (!V_RESULT.status) {
            ctx.body = U.respf(V_RESULT.tip)
        } else {
            const result = await ctx.service.${config.name}.retrieve()
            ctx.body = U.resps(result);
        }
    }

    // 根据id查询${config.chname}
    async retrieveById () {
        const { ctx } = this;
        // 参数校验
        const CUSTOM_VALIDATE = []
        const V_RESULT = U.validateParams(ctx.params, [V.id, ...CUSTOM_VALIDATE])

        // 响应处理
        if (!V_RESULT.status) {
            ctx.body = U.respf(V_RESULT.tip)
        } else {
            const result = await ctx.service.${config.name}.retrieveById()
            ctx.body = typeof result === 'object' ? U.resps(result) : U.respf(result);
        }
    }

    // 删除${config.chname}
    async delete () {
        const { ctx } = this;
        // 参数校验
        const CUSTOM_VALIDATE = []
        const V_RESULT = U.validateParams(ctx.params, [V.id, ...CUSTOM_VALIDATE])

        // 响应处理
        if (!V_RESULT.status) {
            ctx.body = U.respf(V_RESULT.tip)
        } else {
            const result = await ctx.service.${config.name}.delete()
            ctx.body = typeof result === 'object' ? U.resps(result) : U.respf(result);
        }
    }

    // 修改${config.chname}信息
    async update (){
        const { ctx } = this;
        // 参数校验
        const CUSTOM_VALIDATE = []
        const V_RESULT = U.validateParams(ctx.params, [V.id, ...CUSTOM_VALIDATE])

        // 响应处理
        if (!V_RESULT.status) {
            ctx.body = U.respf(V_RESULT.tip)
        } else {
            const result = await ctx.service.${config.name}.update()
            ctx.body = typeof result === 'object' ? U.resps(result) : U.respf(result);
        }
    }

    // 新增${config.chname}
    async create (){
        const { ctx } = this;
        // 参数校验
        const CUSTOM_VALIDATE = []
        const V_RESULT = U.validateParams(ctx.request.body, [...CUSTOM_VALIDATE])

        // 响应处理
        if (!V_RESULT.status) {
            ctx.body = U.respf(V_RESULT.tip)
        } else {
            const result = await ctx.service.${config.name}.create()
            ctx.body = typeof result === 'object' ? U.resps(result) : U.respf(result);
        }
    }
}

module.exports = ${config.modelName}Controller;


`)
maker.closeFile(`${config.name}.controller.js`)
console.log(`----生成 ${config.name}.controller.js 结束----`)

// console.log(config.scheme)
// return
// 生成model文件
console.log(`----生成 ${config.modelName}.model.js 开始----`)
// 获取数据库配置字段信息
maker.openFile(`${config.modelName}.model.js`)
maker.line(`'use strict';`)
maker.line(`
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const ${config.modelName}Schema = new Schema(${JSON.stringify(config.scheme)});
    return mongoose.model('${config.modelName}', ${config.modelName}Schema);
};
`)

maker.closeFile(`${config.modelName}.model.js`)
console.log(`----生成 ${config.modelName}.model.js 结束----`)

// 生成api接口
console.log(`----生成 ${config.name}.api.js 开始----`)
maker.openFile(`${config.name}.api.js`)
maker.line(`

// 查询 ${config.chname}
  router.post('/api/${config.version}/${config.name}', controller.${config.name}.retrieve);
// 根据id查询${config.chname}
  router.get('/api/${config.version}/${config.name}/:id', controller.${config.name}.retrieveById);
// 删除${config.chname}
  router.delete('/api/${config.version}/${config.name}/:id', controller.${config.name}.delete);
// 修改${config.chname}
  router.put('/api/${config.version}/${config.name}/:id', controller.${config.name}.update);
// 新增${config.chname}
  router.post('/api/${config.version}/${config.name}/create',controller.${config.name}.create);
`
)


maker.closeFile(`${config.name}.api.js`)
console.log(`----生成 ${config.name}.api.js 结束----`)

// 生成接口测试文件
console.log(`----生成 ${config.name}.apiTest.js 开始----`)
maker.openFile(`${config.name}.apiTest.js`)
maker.line(`

const request = require("superagent")
const mock = require("mockjs")
const Random = mock.Random
const moment = require('moment')

const config = require("../model.config")
const scheme = config.scheme
// 根据集合配置生成新增数据
let mockData = {}
for (const key in scheme) {
    if (scheme.hasOwnProperty(key)) {
        if (scheme[key] && scheme[key].required) {
            switch (scheme[key].type) {
                case "String":
                    mockData[key] = Random.string()
                    break;
                case "Number":
                    mockData[key] = Math.floor(Math.random() * 10)
                    break;
                case "Boolean":
                    mockData[key] = Random.boolean()
                    break;
                default:
                    break;
            }
            if (key === 'createTime') {
                mockData[key] = moment().format("YYYY-MM-DD HH:mm:ss")
            }
        }
    }
}
/* 接口测试顺序 新增 查询 修改 删除  */

async function createTest (mockData) {
    // post
    const result = await request.post('${baseUrl}/create')
        .set("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmEwNTg0YmYxM2NiZjdkYzI0NGUxNjYiLCJnZXN0dXJlUHdkIjpudWxsLCJhdmF0YXIiOiJodHRwczovL3JlY29yZGltYWdlcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vMTU3NDUyODU1NDE5NS5wbmciLCJ1c2VybmFtZSI6IuWuieatjCIsImNyZWF0ZVRpbWUiOiIyMDE4LTA5LTE4IDA5OjQzOjI3IiwicGhvbmUiOiIxODA3NTU3MTQ2MCIsInByb3RvY29sIjp0cnVlLCJfX3YiOjAsImZ1bmNVc2UiOiIsNCwxLDIiLCJwYXNzd29yZCI6IjIwOTE3Yzg1MWM0YTU0ZjJhMDU0MzkwZGFjOTA4NWI3IiwiY29pbiI6NjI3OSwidGltZXN0YW1wIjoiMTIzNDU2IiwidG9vbHMiOm51bGwsImJlaXlvbmcxIjoxLCJiZWl5b25nMiI6bnVsbCwiYmVpeW9uZzMiOm51bGwsImJlaXlvbmc0IjpudWxsLCJiZWl5b25nNSI6bnVsbCwicHVuY2hMaW1pdFRpbWUiOjIzMzAsInB1bmNoTW9kZWwiOjMsImRheUxpbWl0Ijo0MCwibW9udGhMaW1pdCI6MTAwLCJoYWxmWWVhckxpbWl0Ijo0MDEsImJpbGxEYXlMaW1pdCI6MzAsInJlY29yZERheUxpbWl0Ijo1MCwic2hhcmVEYXlMaW1pdCI6MzAsImxldmVsTmFtZSI6IuengOeahyIsImxldmVsIjoiTHY3IiwiZGF5TGltaXRDb3VudCI6NCwibW9udGhMaW1pdENvdW50Ijo1LCJoYWxmWWVhckxpbWl0Q291bnQiOjQsImJpbGxEYXlMaW1pdENvdW50IjozLCJhdmFpbGFibGVDb2luIjo2Mjc5LCJzaGFyZVRhcmdldERheSI6MSwic2F2ZVNoYXJlSW1nRGF5IjowLCJpc1JlYWRUb2RheSI6MCwicmVhZFRpbWVUb2RheSI6MCwibGFzdFRpbWVTdGVtcCI6MCwicmVhZDE1IjoxLCJyZWFkMzAiOjEsInJlYWQ0NSI6MSwicmVhZDYwIjoxLCJpYXQiOjE1Nzk1MDAzNzh9.Duir2vnmL3YCaf26R7nagW3nkV3_94J1ggiTp435WQ0")
        .set('Content-Type', 'application/json')
        .send(mockData)
    return result
}

async function retrieveByIdTest (id) {
    const result = await request.get('${baseUrl}/'+id)
        .set("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmEwNTg0YmYxM2NiZjdkYzI0NGUxNjYiLCJnZXN0dXJlUHdkIjpudWxsLCJhdmF0YXIiOiJodHRwczovL3JlY29yZGltYWdlcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vMTU3NDUyODU1NDE5NS5wbmciLCJ1c2VybmFtZSI6IuWuieatjCIsImNyZWF0ZVRpbWUiOiIyMDE4LTA5LTE4IDA5OjQzOjI3IiwicGhvbmUiOiIxODA3NTU3MTQ2MCIsInByb3RvY29sIjp0cnVlLCJfX3YiOjAsImZ1bmNVc2UiOiIsNCwxLDIiLCJwYXNzd29yZCI6IjIwOTE3Yzg1MWM0YTU0ZjJhMDU0MzkwZGFjOTA4NWI3IiwiY29pbiI6NjI3OSwidGltZXN0YW1wIjoiMTIzNDU2IiwidG9vbHMiOm51bGwsImJlaXlvbmcxIjoxLCJiZWl5b25nMiI6bnVsbCwiYmVpeW9uZzMiOm51bGwsImJlaXlvbmc0IjpudWxsLCJiZWl5b25nNSI6bnVsbCwicHVuY2hMaW1pdFRpbWUiOjIzMzAsInB1bmNoTW9kZWwiOjMsImRheUxpbWl0Ijo0MCwibW9udGhMaW1pdCI6MTAwLCJoYWxmWWVhckxpbWl0Ijo0MDEsImJpbGxEYXlMaW1pdCI6MzAsInJlY29yZERheUxpbWl0Ijo1MCwic2hhcmVEYXlMaW1pdCI6MzAsImxldmVsTmFtZSI6IuengOeahyIsImxldmVsIjoiTHY3IiwiZGF5TGltaXRDb3VudCI6NCwibW9udGhMaW1pdENvdW50Ijo1LCJoYWxmWWVhckxpbWl0Q291bnQiOjQsImJpbGxEYXlMaW1pdENvdW50IjozLCJhdmFpbGFibGVDb2luIjo2Mjc5LCJzaGFyZVRhcmdldERheSI6MSwic2F2ZVNoYXJlSW1nRGF5IjowLCJpc1JlYWRUb2RheSI6MCwicmVhZFRpbWVUb2RheSI6MCwibGFzdFRpbWVTdGVtcCI6MCwicmVhZDE1IjoxLCJyZWFkMzAiOjEsInJlYWQ0NSI6MSwicmVhZDYwIjoxLCJpYXQiOjE1Nzk1MDAzNzh9.Duir2vnmL3YCaf26R7nagW3nkV3_94J1ggiTp435WQ0")
        .set('Content-Type', 'application/json')
    return result
}

async function updateTest (id,params) {
    const result = await request.put('${baseUrl}/'+id)
        .set("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmEwNTg0YmYxM2NiZjdkYzI0NGUxNjYiLCJnZXN0dXJlUHdkIjpudWxsLCJhdmF0YXIiOiJodHRwczovL3JlY29yZGltYWdlcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vMTU3NDUyODU1NDE5NS5wbmciLCJ1c2VybmFtZSI6IuWuieatjCIsImNyZWF0ZVRpbWUiOiIyMDE4LTA5LTE4IDA5OjQzOjI3IiwicGhvbmUiOiIxODA3NTU3MTQ2MCIsInByb3RvY29sIjp0cnVlLCJfX3YiOjAsImZ1bmNVc2UiOiIsNCwxLDIiLCJwYXNzd29yZCI6IjIwOTE3Yzg1MWM0YTU0ZjJhMDU0MzkwZGFjOTA4NWI3IiwiY29pbiI6NjI3OSwidGltZXN0YW1wIjoiMTIzNDU2IiwidG9vbHMiOm51bGwsImJlaXlvbmcxIjoxLCJiZWl5b25nMiI6bnVsbCwiYmVpeW9uZzMiOm51bGwsImJlaXlvbmc0IjpudWxsLCJiZWl5b25nNSI6bnVsbCwicHVuY2hMaW1pdFRpbWUiOjIzMzAsInB1bmNoTW9kZWwiOjMsImRheUxpbWl0Ijo0MCwibW9udGhMaW1pdCI6MTAwLCJoYWxmWWVhckxpbWl0Ijo0MDEsImJpbGxEYXlMaW1pdCI6MzAsInJlY29yZERheUxpbWl0Ijo1MCwic2hhcmVEYXlMaW1pdCI6MzAsImxldmVsTmFtZSI6IuengOeahyIsImxldmVsIjoiTHY3IiwiZGF5TGltaXRDb3VudCI6NCwibW9udGhMaW1pdENvdW50Ijo1LCJoYWxmWWVhckxpbWl0Q291bnQiOjQsImJpbGxEYXlMaW1pdENvdW50IjozLCJhdmFpbGFibGVDb2luIjo2Mjc5LCJzaGFyZVRhcmdldERheSI6MSwic2F2ZVNoYXJlSW1nRGF5IjowLCJpc1JlYWRUb2RheSI6MCwicmVhZFRpbWVUb2RheSI6MCwibGFzdFRpbWVTdGVtcCI6MCwicmVhZDE1IjoxLCJyZWFkMzAiOjEsInJlYWQ0NSI6MSwicmVhZDYwIjoxLCJpYXQiOjE1Nzk1MDAzNzh9.Duir2vnmL3YCaf26R7nagW3nkV3_94J1ggiTp435WQ0")
        .set('Content-Type', 'application/json')
        .send(params)
    return result
}

async function deleteTest (id) {
    const result = await request.delete('${baseUrl}/'+id)
        .set("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmEwNTg0YmYxM2NiZjdkYzI0NGUxNjYiLCJnZXN0dXJlUHdkIjpudWxsLCJhdmF0YXIiOiJodHRwczovL3JlY29yZGltYWdlcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vMTU3NDUyODU1NDE5NS5wbmciLCJ1c2VybmFtZSI6IuWuieatjCIsImNyZWF0ZVRpbWUiOiIyMDE4LTA5LTE4IDA5OjQzOjI3IiwicGhvbmUiOiIxODA3NTU3MTQ2MCIsInByb3RvY29sIjp0cnVlLCJfX3YiOjAsImZ1bmNVc2UiOiIsNCwxLDIiLCJwYXNzd29yZCI6IjIwOTE3Yzg1MWM0YTU0ZjJhMDU0MzkwZGFjOTA4NWI3IiwiY29pbiI6NjI3OSwidGltZXN0YW1wIjoiMTIzNDU2IiwidG9vbHMiOm51bGwsImJlaXlvbmcxIjoxLCJiZWl5b25nMiI6bnVsbCwiYmVpeW9uZzMiOm51bGwsImJlaXlvbmc0IjpudWxsLCJiZWl5b25nNSI6bnVsbCwicHVuY2hMaW1pdFRpbWUiOjIzMzAsInB1bmNoTW9kZWwiOjMsImRheUxpbWl0Ijo0MCwibW9udGhMaW1pdCI6MTAwLCJoYWxmWWVhckxpbWl0Ijo0MDEsImJpbGxEYXlMaW1pdCI6MzAsInJlY29yZERheUxpbWl0Ijo1MCwic2hhcmVEYXlMaW1pdCI6MzAsImxldmVsTmFtZSI6IuengOeahyIsImxldmVsIjoiTHY3IiwiZGF5TGltaXRDb3VudCI6NCwibW9udGhMaW1pdENvdW50Ijo1LCJoYWxmWWVhckxpbWl0Q291bnQiOjQsImJpbGxEYXlMaW1pdENvdW50IjozLCJhdmFpbGFibGVDb2luIjo2Mjc5LCJzaGFyZVRhcmdldERheSI6MSwic2F2ZVNoYXJlSW1nRGF5IjowLCJpc1JlYWRUb2RheSI6MCwicmVhZFRpbWVUb2RheSI6MCwibGFzdFRpbWVTdGVtcCI6MCwicmVhZDE1IjoxLCJyZWFkMzAiOjEsInJlYWQ0NSI6MSwicmVhZDYwIjoxLCJpYXQiOjE1Nzk1MDAzNzh9.Duir2vnmL3YCaf26R7nagW3nkV3_94J1ggiTp435WQ0")
        .set('Content-Type', 'application/json')
    return result
}

async function retrieveTest (){
    const params = {
        pageSize:10,
        pageNumber:1,
        sort:{
            createTime:1
        }
    }
    const result = await request.post('${baseUrl}')
        .set("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmEwNTg0YmYxM2NiZjdkYzI0NGUxNjYiLCJnZXN0dXJlUHdkIjpudWxsLCJhdmF0YXIiOiJodHRwczovL3JlY29yZGltYWdlcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vMTU3NDUyODU1NDE5NS5wbmciLCJ1c2VybmFtZSI6IuWuieatjCIsImNyZWF0ZVRpbWUiOiIyMDE4LTA5LTE4IDA5OjQzOjI3IiwicGhvbmUiOiIxODA3NTU3MTQ2MCIsInByb3RvY29sIjp0cnVlLCJfX3YiOjAsImZ1bmNVc2UiOiIsNCwxLDIiLCJwYXNzd29yZCI6IjIwOTE3Yzg1MWM0YTU0ZjJhMDU0MzkwZGFjOTA4NWI3IiwiY29pbiI6NjI3OSwidGltZXN0YW1wIjoiMTIzNDU2IiwidG9vbHMiOm51bGwsImJlaXlvbmcxIjoxLCJiZWl5b25nMiI6bnVsbCwiYmVpeW9uZzMiOm51bGwsImJlaXlvbmc0IjpudWxsLCJiZWl5b25nNSI6bnVsbCwicHVuY2hMaW1pdFRpbWUiOjIzMzAsInB1bmNoTW9kZWwiOjMsImRheUxpbWl0Ijo0MCwibW9udGhMaW1pdCI6MTAwLCJoYWxmWWVhckxpbWl0Ijo0MDEsImJpbGxEYXlMaW1pdCI6MzAsInJlY29yZERheUxpbWl0Ijo1MCwic2hhcmVEYXlMaW1pdCI6MzAsImxldmVsTmFtZSI6IuengOeahyIsImxldmVsIjoiTHY3IiwiZGF5TGltaXRDb3VudCI6NCwibW9udGhMaW1pdENvdW50Ijo1LCJoYWxmWWVhckxpbWl0Q291bnQiOjQsImJpbGxEYXlMaW1pdENvdW50IjozLCJhdmFpbGFibGVDb2luIjo2Mjc5LCJzaGFyZVRhcmdldERheSI6MSwic2F2ZVNoYXJlSW1nRGF5IjowLCJpc1JlYWRUb2RheSI6MCwicmVhZFRpbWVUb2RheSI6MCwibGFzdFRpbWVTdGVtcCI6MCwicmVhZDE1IjoxLCJyZWFkMzAiOjEsInJlYWQ0NSI6MSwicmVhZDYwIjoxLCJpYXQiOjE1Nzk1MDAzNzh9.Duir2vnmL3YCaf26R7nagW3nkV3_94J1ggiTp435WQ0")
        .set('Content-Type', 'application/json')
        .send(params)
    return result

}

async function mainTest () {
    let status = true
    console.log('新增${config.chname}测试开始')
    const createResult = await createTest(mockData)
    let id = null
    if (!createResult.body.success) {
        status = false
        console.log('新增${config.chname}测试'+createResult.body.message+'[测试终止]')
        return
    }else{
        console.log('新增${config.chname}测试'+createResult.body.message+'['+createResult.body.data.createTime+']')
        id = createResult.body.data._id
    }
    let info = createResult.body.data
    mockData.createTime = moment().format("YYYY-MM-DD HH:mm:ss")
    console.log('修改${config.chname}测试开始')
    console.log('变更内容:[createTime]'+mockData.createTime)
    const updateResult = await updateTest(info._id,mockData)
    if (!updateResult.body.success) {
        status = false
        console.log('修改${config.chname}测试'+updateResult.body.message+'[测试终止]')
        return
    }else{
        console.log('修改${config.chname}测试'+updateResult.body.message)
    }
    console.log('根据id查询${config.chname}测试开始')
    const retriveByIdTestResult = await retrieveByIdTest(id)
    if (!retriveByIdTestResult.body.success) {
        status = false
        console.log('根据id查询${config.chname}测试'+retriveByIdTestResult.body.message+'[测试终止]')
        return
    }else{
        console.log('根据id查询${config.chname}测试'+retriveByIdTestResult.body.message+'['+retriveByIdTestResult.body.data.createTime+']')
    }
    console.log('删除${config.chname}测试开始')
    const deleteResult = await deleteTest(id)
    if (!deleteResult.body.success) {
        status = false
        console.log('删除${config.chname}测试'+deleteResult.body.message+'[测试终止]')
        return
    }else{
        console.log('删除${config.chname}测试'+deleteResult.body.message)
    }
    console.log('查询${config.chname}测试开始')
    const retrieveResult = await retrieveTest()
    if (!retrieveResult.body.success) {
        status = false
        console.log('查询${config.chname}测试'+retrieveResult.body.message+'['+测试终止+']')
        return
    }else{
        console.log('查询${config.chname}测试'+retrieveResult.body.message+'['+retrieveResult.body.data.list.length+']')
    }
    if(status){
        console.log('--------[${config.chname}模块生成接口已测试通过]--------')
    }
}

mainTest()
`
)


maker.closeFile(`${config.name}.apiTest.js`)
console.log(`----生成 ${config.name}.apiTest.js 结束----`)


let cmd = `cd ./gen/;mv ./${config.name}.service.js ${config.output.service}/${config.name}.js;
mv ./${config.name}.controller.js ${config.output.controller}/${config.name}.js;
mv ./${config.modelName}.model.js ${config.output.model}/${config.modelName}.js;
`
maker.save("./gen/")
exec(cmd, (e, s, t) => {
    if (e) {
        console.log(e)
    } else {
        console.log("文件移动成功")
    }
})