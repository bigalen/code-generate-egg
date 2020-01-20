const exec = require('child_process').exec
const { CodeMaker } = require("codemaker")
const config = require("./model.config")
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
let cmd = `cd ./gen/;mv ./${config.name}.service.js ${config.output.service}/${config.name}.js;
mv ./${config.name}.controller.js ${config.output.controller}/${config.name}.js;
mv ./${config.modelName}.model.js ${config.output.model}/${config.modelName}.js;
`
// let test = `sed -i "bak" 's/};/${appendText}};/' router.js`
maker.save("./gen/")
exec(cmd, (e, s, t) => {
    if (e) {
        console.log(e)
    } else {
        console.log("文件移动成功")
    }
})