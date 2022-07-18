const Router = require('koa-router');
const router = new Router();

const routerMap = {
  controllers: {},
  modules: {
    page: {
      routes: require('./page.route'),
      Controller: require(`../controller/page.controller`)
    },
    public: {
      routes: require('./public.route'),
      Controller: require(`../controller/public.controller`)
    }
  },
  getCtr(namespace) {
    if (this === routerMap) {
      if (this.controllers[namespace]) {
        return this.controllers[namespace];
      } else if (this.modules[namespace]) {
        const controller = new this.modules[namespace].Controller();
        return (this.controllers[namespace] = controller);
      }
    }
  }
};

Object.keys(routerMap.modules).forEach((namespace) => {
  const routes = routerMap.modules[namespace].routes;
  const controller = routerMap.getCtr(namespace);
  routes.forEach(({ method, path, action }) => {
    router[method](path, controller[action].bind(controller));
  });
});

// 404页面
const pageController = routerMap.getCtr('page');
router.get(/^(?!\/api).*/, async (ctx, next) => {
  if (/\./g.test(ctx.path)) {
    return next();
  }
  return pageController.notFound(ctx, next);
});

module.exports = router;
