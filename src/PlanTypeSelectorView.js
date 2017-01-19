class PlanTypeSelectorView {
  constructor(app) {
    this.$selectors = $('[data-plan-select]')
    this.$selectors.on('click', function(e) {
      e.preventDefault()
      app.selectPlanType(e.currentTarget.dataset.planSelect);
    })
    app.onChange('planTypeSelected', this.render.bind(this))
  }

  render(props) {
    this.$selectors.each((i, element) => {
      if(element.dataset.planSelect === props.planTypeSelected) {
        $(element).addClass('active')
      } else {
        $(element).removeClass('active')
      }
    })
  }
}

export default PlanTypeSelectorView;