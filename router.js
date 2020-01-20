'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 查询 
  router.post('/api/v1/message', controller.message.retrieve);
  //   根据id查询
  router.get('/api/v1/message/:id', controller.message.retrieveById);
  //   删除
  router.delete('/api/v1/message/:id', controller.message.delete);
  //   修改
  router.put('/api/v1/message/:id', controller.message.update);
  //   新增
  router.post('/api/v1/message/create', controller.message.create);


};
