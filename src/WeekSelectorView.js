class WeekSelectorView {
  constructor(app) {
    $('#week_selector').on('change', function(e) {
      const $weekSelector = e.target
      app.selectWeek($weekSelector.options[$weekSelector.selectedIndex].value);
    })
  }
}

export default WeekSelectorView;