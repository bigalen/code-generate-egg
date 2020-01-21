module.exports = config = {
    name: "user",
    modelName: "User",
    chname: "用户",
    version: "v1",
    output: {
        service: "/Users/mac/Desktop/nodeTest/monitor-server-egg/app/service",
        controller: "/Users/mac/Desktop/nodeTest/monitor-server-egg/app/controller",
        model: "/Users/mac/Desktop/nodeTest/monitor-server-egg/app/model"
    },
    scheme: {
        phone: {
            required: true,
            type: "String"
        },
        gesturePwd: {
            type: "String"
        },
        avatar: {
            required: true,
            type: "String",
            default: ''
        },
        username: {
            required: true,
            type: "String",
        },
        protocol: {
            type: "Boolean",
            required: true,
            default: true
        },
        createTime: {
            required: true,
            type: "String"
        },
        coin: {
            type: "Number",
            default: 0
        },
        password: {
            type: "String",
            default: ''
        },
        funcUse: {
            type: "String",
            default: '1,2,3'
        },
        punchModel: {
            type: "Number",
            default: 1
        },
        punchLimitTime: {
            type: "Number",
            default: 1800
        },
        dayLimit: {
            type: "Number",
            default: 40,
        },
        monthLimit: {
            type: "Number",
            default: 100,
        },
        halfYearLimit: {
            type: "Number",
            default: 500,
        },
        billDayLimit: {
            type: "Number",
            default: 30,
        },
        dayLimitCount: {
            type: "Number",
            default: 4,
        },
        monthLimitCount: {
            type: "Number",
            default: 5,
        },
        halfYearLimitCount: {
            type: "Number",
            default: 5,
        },
        billDayLimitCount: {
            type: "Number",
            default: 3,
        },
        recordDayLimit: {
            type: "Number",
            default: 50,
        },
        shareDayLimit: {
            type: "Number",
            default: 30,
        },
        levelName: {
            type: "String",
            default: '秀之气'
        },
        level: {
            type: "String",
            default: 'Lv1'
        },
        availableCoin: {
            type: "Number",
            default: 0
        },
        shareTargetDay: {
            type: "Number",
            default: 1
        },
        saveShareImgDay: {
            type: "Number",
            default: 0
        },
        isReadToday: {
            type: "Number",
            default: 0
        },
        readTimeToday: {
            type: "Number",
            default: 0
        },
        lastTimeStemp: {
            type: "Number",
            default: 0
        },
        read15: {
            type: "Number",
            default: 1
        },
        read30: {
            type: "Number",
            default: 1
        },
        read45: {
            type: "Number",
            default: 1
        },
        read60: {
            type: "Number",
            default: 1
        }
    }
}