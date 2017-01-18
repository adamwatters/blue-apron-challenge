import App from './App'
import PlanTypeSelectorView from './PlanTypeSelectorView'
import WeekSelectorView from './WeekSelectorView'
import RecipesView from './RecipesView'

const appConfig = {
  planOptions: ['two_person', 'family'],
  planTypeSelected: 'two_person',
  weekOptions: ['2016-03-21', '2016-03-28'],
  weekSelected: '2016-03-21',
}

$(()=>{
  const app = new App(appConfig)
  const weekSelectorView = new WeekSelectorView(app)
  const planTypeSelectorView = new PlanTypeSelectorView(app)
  const recipesView = new RecipesView(app)
  app.init()
})


