class WeekSelectorView {
  constructor(app) {
    this.$selector = $('#week-selector')
    app.weekOptions.forEach((week) => {
      const selected = week === app.weekSelected ? 'selected' : ''
      this.$selector.append(`<option ${selected} value="${week}">${week}</option>`)
    })
    this.$selector.on('change', (e) => {
      const selectorElement = e.target
      app.selectWeek(selectorElement.options[selectorElement.selectedIndex].value);
    })
  }
}

export default WeekSelectorView;