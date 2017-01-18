import App from './App'
import WeekSelectorView from './WeekSelectorView'
import RecipesView from './RecipesView'

const appConfig = {
  planOptions: ['two_person', 'family'],
  planTypeSelected: 'two_person',
  weekOptions: ['2016-03-21', '2016-03-28'],
  weekSelected: '2016_03_21',
}

$(()=>{
  const app = new App(appConfig)
  const recipesView = new RecipesView(app)
  const weekSelectorView = new WeekSelectorView(app)
})


