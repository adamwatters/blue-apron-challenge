const buttonTemplate = Handlebars.compile($('#product-pairing-button-template').html());

class ProductPairingButtonView {
  constructor(productPairing, app) {
    this.disabled = productPairing.fetching
    this.$button = $(buttonTemplate({
      content: productPairing.fetching ? 'fetching...' : 'View Wine Pairing',
      disabled: productPairing.fetching ? 'disabled' : ''
    }))
    this.$button.on('click', () => {
      if (!this.disabled) {
        app.productPairings.setActiveProductPairing(productPairing.id)
      }
    })
    productPairing.onChange('fetching', this.render.bind(this))
  }

  build() {
    return this.$button
  }

  render(props) {
    const $content = this.$button.find('#product-pairing-button-content')
    if (!props.fetching) {
      $content.html('View Wine Pairing')
      this.$button.removeAttr('disabled')
    }
  }
}

export default ProductPairingButtonView;