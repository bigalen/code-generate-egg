

// 查询 用户
  router.post('/api/v1/user', controller.user.retrieve);
// 根据id查询用户
  router.get('/api/v1/user/:id', controller.user.retrieveById);
// 删除用户
  router.delete('/api/v1/user/:id', controller.user.delete);
// 修改用户
  router.put('/api/v1/user/:id', controller.user.update);
// 新增用户
  router.post('/api/v1/user/create',controller.user.create);

