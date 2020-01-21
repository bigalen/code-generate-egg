

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
    const result = await request.post('http://127.0.0.1:7001/api/v1/user/create')
        .set("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmEwNTg0YmYxM2NiZjdkYzI0NGUxNjYiLCJnZXN0dXJlUHdkIjpudWxsLCJhdmF0YXIiOiJodHRwczovL3JlY29yZGltYWdlcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vMTU3NDUyODU1NDE5NS5wbmciLCJ1c2VybmFtZSI6IuWuieatjCIsImNyZWF0ZVRpbWUiOiIyMDE4LTA5LTE4IDA5OjQzOjI3IiwicGhvbmUiOiIxODA3NTU3MTQ2MCIsInByb3RvY29sIjp0cnVlLCJfX3YiOjAsImZ1bmNVc2UiOiIsNCwxLDIiLCJwYXNzd29yZCI6IjIwOTE3Yzg1MWM0YTU0ZjJhMDU0MzkwZGFjOTA4NWI3IiwiY29pbiI6NjI3OSwidGltZXN0YW1wIjoiMTIzNDU2IiwidG9vbHMiOm51bGwsImJlaXlvbmcxIjoxLCJiZWl5b25nMiI6bnVsbCwiYmVpeW9uZzMiOm51bGwsImJlaXlvbmc0IjpudWxsLCJiZWl5b25nNSI6bnVsbCwicHVuY2hMaW1pdFRpbWUiOjIzMzAsInB1bmNoTW9kZWwiOjMsImRheUxpbWl0Ijo0MCwibW9udGhMaW1pdCI6MTAwLCJoYWxmWWVhckxpbWl0Ijo0MDEsImJpbGxEYXlMaW1pdCI6MzAsInJlY29yZERheUxpbWl0Ijo1MCwic2hhcmVEYXlMaW1pdCI6MzAsImxldmVsTmFtZSI6IuengOeahyIsImxldmVsIjoiTHY3IiwiZGF5TGltaXRDb3VudCI6NCwibW9udGhMaW1pdENvdW50Ijo1LCJoYWxmWWVhckxpbWl0Q291bnQiOjQsImJpbGxEYXlMaW1pdENvdW50IjozLCJhdmFpbGFibGVDb2luIjo2Mjc5LCJzaGFyZVRhcmdldERheSI6MSwic2F2ZVNoYXJlSW1nRGF5IjowLCJpc1JlYWRUb2RheSI6MCwicmVhZFRpbWVUb2RheSI6MCwibGFzdFRpbWVTdGVtcCI6MCwicmVhZDE1IjoxLCJyZWFkMzAiOjEsInJlYWQ0NSI6MSwicmVhZDYwIjoxLCJpYXQiOjE1Nzk1MDAzNzh9.Duir2vnmL3YCaf26R7nagW3nkV3_94J1ggiTp435WQ0")
        .set('Content-Type', 'application/json')
        .send(mockData)
    return result
}

async function retrieveByIdTest (id) {
    const result = await request.get('http://127.0.0.1:7001/api/v1/user/'+id)
        .set("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmEwNTg0YmYxM2NiZjdkYzI0NGUxNjYiLCJnZXN0dXJlUHdkIjpudWxsLCJhdmF0YXIiOiJodHRwczovL3JlY29yZGltYWdlcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vMTU3NDUyODU1NDE5NS5wbmciLCJ1c2VybmFtZSI6IuWuieatjCIsImNyZWF0ZVRpbWUiOiIyMDE4LTA5LTE4IDA5OjQzOjI3IiwicGhvbmUiOiIxODA3NTU3MTQ2MCIsInByb3RvY29sIjp0cnVlLCJfX3YiOjAsImZ1bmNVc2UiOiIsNCwxLDIiLCJwYXNzd29yZCI6IjIwOTE3Yzg1MWM0YTU0ZjJhMDU0MzkwZGFjOTA4NWI3IiwiY29pbiI6NjI3OSwidGltZXN0YW1wIjoiMTIzNDU2IiwidG9vbHMiOm51bGwsImJlaXlvbmcxIjoxLCJiZWl5b25nMiI6bnVsbCwiYmVpeW9uZzMiOm51bGwsImJlaXlvbmc0IjpudWxsLCJiZWl5b25nNSI6bnVsbCwicHVuY2hMaW1pdFRpbWUiOjIzMzAsInB1bmNoTW9kZWwiOjMsImRheUxpbWl0Ijo0MCwibW9udGhMaW1pdCI6MTAwLCJoYWxmWWVhckxpbWl0Ijo0MDEsImJpbGxEYXlMaW1pdCI6MzAsInJlY29yZERheUxpbWl0Ijo1MCwic2hhcmVEYXlMaW1pdCI6MzAsImxldmVsTmFtZSI6IuengOeahyIsImxldmVsIjoiTHY3IiwiZGF5TGltaXRDb3VudCI6NCwibW9udGhMaW1pdENvdW50Ijo1LCJoYWxmWWVhckxpbWl0Q291bnQiOjQsImJpbGxEYXlMaW1pdENvdW50IjozLCJhdmFpbGFibGVDb2luIjo2Mjc5LCJzaGFyZVRhcmdldERheSI6MSwic2F2ZVNoYXJlSW1nRGF5IjowLCJpc1JlYWRUb2RheSI6MCwicmVhZFRpbWVUb2RheSI6MCwibGFzdFRpbWVTdGVtcCI6MCwicmVhZDE1IjoxLCJyZWFkMzAiOjEsInJlYWQ0NSI6MSwicmVhZDYwIjoxLCJpYXQiOjE1Nzk1MDAzNzh9.Duir2vnmL3YCaf26R7nagW3nkV3_94J1ggiTp435WQ0")
        .set('Content-Type', 'application/json')
    return result
}

async function updateTest (id,params) {
    const result = await request.put('http://127.0.0.1:7001/api/v1/user/'+id)
        .set("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmEwNTg0YmYxM2NiZjdkYzI0NGUxNjYiLCJnZXN0dXJlUHdkIjpudWxsLCJhdmF0YXIiOiJodHRwczovL3JlY29yZGltYWdlcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vMTU3NDUyODU1NDE5NS5wbmciLCJ1c2VybmFtZSI6IuWuieatjCIsImNyZWF0ZVRpbWUiOiIyMDE4LTA5LTE4IDA5OjQzOjI3IiwicGhvbmUiOiIxODA3NTU3MTQ2MCIsInByb3RvY29sIjp0cnVlLCJfX3YiOjAsImZ1bmNVc2UiOiIsNCwxLDIiLCJwYXNzd29yZCI6IjIwOTE3Yzg1MWM0YTU0ZjJhMDU0MzkwZGFjOTA4NWI3IiwiY29pbiI6NjI3OSwidGltZXN0YW1wIjoiMTIzNDU2IiwidG9vbHMiOm51bGwsImJlaXlvbmcxIjoxLCJiZWl5b25nMiI6bnVsbCwiYmVpeW9uZzMiOm51bGwsImJlaXlvbmc0IjpudWxsLCJiZWl5b25nNSI6bnVsbCwicHVuY2hMaW1pdFRpbWUiOjIzMzAsInB1bmNoTW9kZWwiOjMsImRheUxpbWl0Ijo0MCwibW9udGhMaW1pdCI6MTAwLCJoYWxmWWVhckxpbWl0Ijo0MDEsImJpbGxEYXlMaW1pdCI6MzAsInJlY29yZERheUxpbWl0Ijo1MCwic2hhcmVEYXlMaW1pdCI6MzAsImxldmVsTmFtZSI6IuengOeahyIsImxldmVsIjoiTHY3IiwiZGF5TGltaXRDb3VudCI6NCwibW9udGhMaW1pdENvdW50Ijo1LCJoYWxmWWVhckxpbWl0Q291bnQiOjQsImJpbGxEYXlMaW1pdENvdW50IjozLCJhdmFpbGFibGVDb2luIjo2Mjc5LCJzaGFyZVRhcmdldERheSI6MSwic2F2ZVNoYXJlSW1nRGF5IjowLCJpc1JlYWRUb2RheSI6MCwicmVhZFRpbWVUb2RheSI6MCwibGFzdFRpbWVTdGVtcCI6MCwicmVhZDE1IjoxLCJyZWFkMzAiOjEsInJlYWQ0NSI6MSwicmVhZDYwIjoxLCJpYXQiOjE1Nzk1MDAzNzh9.Duir2vnmL3YCaf26R7nagW3nkV3_94J1ggiTp435WQ0")
        .set('Content-Type', 'application/json')
        .send(params)
    return result
}

async function deleteTest (id) {
    const result = await request.delete('http://127.0.0.1:7001/api/v1/user/'+id)
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
    const result = await request.post('http://127.0.0.1:7001/api/v1/user')
        .set("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmEwNTg0YmYxM2NiZjdkYzI0NGUxNjYiLCJnZXN0dXJlUHdkIjpudWxsLCJhdmF0YXIiOiJodHRwczovL3JlY29yZGltYWdlcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vMTU3NDUyODU1NDE5NS5wbmciLCJ1c2VybmFtZSI6IuWuieatjCIsImNyZWF0ZVRpbWUiOiIyMDE4LTA5LTE4IDA5OjQzOjI3IiwicGhvbmUiOiIxODA3NTU3MTQ2MCIsInByb3RvY29sIjp0cnVlLCJfX3YiOjAsImZ1bmNVc2UiOiIsNCwxLDIiLCJwYXNzd29yZCI6IjIwOTE3Yzg1MWM0YTU0ZjJhMDU0MzkwZGFjOTA4NWI3IiwiY29pbiI6NjI3OSwidGltZXN0YW1wIjoiMTIzNDU2IiwidG9vbHMiOm51bGwsImJlaXlvbmcxIjoxLCJiZWl5b25nMiI6bnVsbCwiYmVpeW9uZzMiOm51bGwsImJlaXlvbmc0IjpudWxsLCJiZWl5b25nNSI6bnVsbCwicHVuY2hMaW1pdFRpbWUiOjIzMzAsInB1bmNoTW9kZWwiOjMsImRheUxpbWl0Ijo0MCwibW9udGhMaW1pdCI6MTAwLCJoYWxmWWVhckxpbWl0Ijo0MDEsImJpbGxEYXlMaW1pdCI6MzAsInJlY29yZERheUxpbWl0Ijo1MCwic2hhcmVEYXlMaW1pdCI6MzAsImxldmVsTmFtZSI6IuengOeahyIsImxldmVsIjoiTHY3IiwiZGF5TGltaXRDb3VudCI6NCwibW9udGhMaW1pdENvdW50Ijo1LCJoYWxmWWVhckxpbWl0Q291bnQiOjQsImJpbGxEYXlMaW1pdENvdW50IjozLCJhdmFpbGFibGVDb2luIjo2Mjc5LCJzaGFyZVRhcmdldERheSI6MSwic2F2ZVNoYXJlSW1nRGF5IjowLCJpc1JlYWRUb2RheSI6MCwicmVhZFRpbWVUb2RheSI6MCwibGFzdFRpbWVTdGVtcCI6MCwicmVhZDE1IjoxLCJyZWFkMzAiOjEsInJlYWQ0NSI6MSwicmVhZDYwIjoxLCJpYXQiOjE1Nzk1MDAzNzh9.Duir2vnmL3YCaf26R7nagW3nkV3_94J1ggiTp435WQ0")
        .set('Content-Type', 'application/json')
        .send(params)
    return result

}

async function mainTest () {
    let status = true
    console.log('新增用户测试开始')
    const createResult = await createTest(mockData)
    let id = null
    if (!createResult.body.success) {
        status = false
        console.log('新增用户测试'+createResult.body.message+'[测试终止]')
        return
    }else{
        console.log('新增用户测试'+createResult.body.message+'['+createResult.body.data.createTime+']')
        id = createResult.body.data._id
    }
    let info = createResult.body.data
    mockData.createTime = moment().format("YYYY-MM-DD HH:mm:ss")
    console.log('修改用户测试开始')
    console.log('变更内容:[createTime]'+mockData.createTime)
    const updateResult = await updateTest(info._id,mockData)
    if (!updateResult.body.success) {
        status = false
        console.log('修改用户测试'+updateResult.body.message+'[测试终止]')
        return
    }else{
        console.log('修改用户测试'+updateResult.body.message)
    }
    console.log('根据id查询用户测试开始')
    const retriveByIdTestResult = await retrieveByIdTest(id)
    if (!retriveByIdTestResult.body.success) {
        status = false
        console.log('根据id查询用户测试'+retriveByIdTestResult.body.message+'[测试终止]')
        return
    }else{
        console.log('根据id查询用户测试'+retriveByIdTestResult.body.message+'['+retriveByIdTestResult.body.data.createTime+']')
    }
    console.log('删除用户测试开始')
    const deleteResult = await deleteTest(id)
    if (!deleteResult.body.success) {
        status = false
        console.log('删除用户测试'+deleteResult.body.message+'[测试终止]')
        return
    }else{
        console.log('删除用户测试'+deleteResult.body.message)
    }
    console.log('查询用户测试开始')
    const retrieveResult = await retrieveTest()
    if (!retrieveResult.body.success) {
        status = false
        console.log('查询用户测试'+retrieveResult.body.message+'['+测试终止+']')
        return
    }else{
        console.log('查询用户测试'+retrieveResult.body.message+'['+retrieveResult.body.data.list.length+']')
    }
    if(status){
        console.log('--------[用户模块生成接口已测试通过]--------')
    }
}

mainTest()

