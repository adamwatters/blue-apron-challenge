class Router {
  constructor(app) {
    app.onChange('planTypeSelected', this.update.bind(this))
    app.onChange('weekSelected', this.update.bind(this))
  }

  update(state) {
    const plan = state.planTypeSelected
    const week = state.weekSelected
    window.history.pushState(null, null, `?p=${plan}&w=${week}`)
  }

  getParam(n) {
    const name = n.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
}

export default Router;