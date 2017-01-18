import moment from 'moment'

class App {
  constructor(config, recipesView) {
    this.planOptions = config.planOptions;
    this.planTypeSelected = config.planTypeSelected;
    this.weekOptions = config.weekOptions;
    this.weekSelected = config.weekSelected;
    this.fetching = false;
    this.recipes = [];
    this.callbacksFor = {};
  }

  updateRecipes() {
    this.fetchRecipes().then(() => {
      this.callbacksFor.recipes.forEach(cb => cb(this.recipes))
    })
  }

  fetchRecipes() {
    this.fetching = true
    const urlWeek = moment(this.weekSelected).format('YYYY_MM_DD')
    const urlPlan = this.planTypeSelected
    return $.getJSON(`/api/recipes/${urlPlan}/${urlWeek}`).then(response => {
      this.fetching = false;
      this.recipes = response.two_person_plan.recipes.map((r) => r.recipe)
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
    this.updateRecipes()
  }

  selectWeek(week) {
    console.log(week)
    this.weekSelected = week
    this.updateRecipes()
  }

}

export default App;