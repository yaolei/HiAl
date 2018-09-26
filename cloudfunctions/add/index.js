// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let { userInfo, fileID, cloudPath, filePath} = event;
  let { openId, appId } = userInfo;
  try {
    return await db.collection('TestCounters').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _openid: openId,
        fileID: fileID,
        cloudPath: cloudPath,
        filePath: filePath
      }
    })
  } catch (e) {
    console.error(e)
  }
}