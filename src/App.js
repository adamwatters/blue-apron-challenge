import moment from 'moment'

class App {
  constructor(config, recipesView) {
    this.planOptions = config.planOptions;
    this.planTypeSelected = config.planTypeSelected;
    this.weekOptions = config.weekOptions;
    this.weekSelected = config.weekSelected;
    this.productPairing = null;
    this.fetching = false;
    this.recipes = [];
    this.callbacksFor = {};
  }

  init() {
    this.updateRecipes()
  }

  callbackRunnerFor(prop) {
    return () => {
      this.callbacksFor[prop].forEach(cb => cb(this[prop]))
    }
  }

  updateRecipes() {
    this.fetchRecipes().then(this.callbackRunnerFor('recipes'))
  }

  fetchRecipes() {
    this.fetching = true
    const urlWeek = moment(this.weekSelected).format('YYYY_MM_DD')
    const urlPlan = this.planTypeSelected
    return $.getJSON(`/api/recipes/${urlPlan}/${urlWeek}`).then(response => {
      this.fetching = false;
      this.recipes = response[`${this.planTypeSelected}_plan`].recipes.map((r) => r.recipe)
    })
  }

  onChange(attribute, callback) {
    if(this.callbacksFor.hasOwnProperty(attribute)) {
      this.callbacksFor[attribute].push(callback)
    } else {
      this.callbacksFor[attribute] = [callback]
    }
  }

  selectPlanType(planType) {
    this.planTypeSelected = planType
    this.callbacksFor.planTypeSelected.forEach(cb => cb(this.planTypeSelected))
    this.updateRecipes()
  }

  selectWeek(week) {
    this.weekSelected = week
    this.updateRecipes()
  }

  selectProductPairing(productPairingId) {
    this.productPairing = productPairingId
    this.callbackRunnerFor('productPairing')()
  }

}

export default App;