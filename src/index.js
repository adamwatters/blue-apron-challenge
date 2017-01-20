import App from './App'
import ProductPairings from './ProductPairings'

import PlanTypeSelectorView from './PlanTypeSelectorView'
import WeekSelectorView from './WeekSelectorView'
import RecipesView from './RecipesView'
import ProductPairingView from './ProductPairingView'

const appConfig = {
  planOptions: ['two_person', 'family'],
  planTypeSelected: 'two_person',
  weekOptions: ['2016-03-21', '2016-03-28'],
  weekSelected: '2016-03-21',
}

const models = {
  productPairings: new ProductPairings()
}

const app = new App(appConfig, models)

$(()=>{
  const weekSelectorView = new WeekSelectorView(app)
  const planTypeSelectorView = new PlanTypeSelectorView(app)
  const recipesView = new RecipesView(app)
  const productPairingView = new ProductPairingView(app)
  app.init()
})


