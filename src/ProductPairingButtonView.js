const buttonTemplate = Handlebars.compile($('#product-pairing-button-template').html());

class ProductPairingButtonView {
  constructor(productPairing, app) {
    this.productPairing = productPairing
    this.$button = $(buttonTemplate({
      content: productPairing.fetching ? 'fetching...' : 'View Wine Pairing',
      disabled: productPairing.fetching ? 'disabled' : ''
    }))
    this.$button.on('click', () => {
      if (!productPairing.fetching) {
        app.productPairings.setActiveProductPairing(productPairing.id)
      }
    })
    this.listenerID = productPairing.onChange('fetching', this.render.bind(this))
  }

  build() {
    return this.$button
  }

  destroy() {
    this.$button.off()
    this.productPairing.removeListener(this.listenerID)
  }

  render(props) {
    const $content = this.$button.find('#product-pairing-button-content')
    if (!props.fetching) {
      $content.html('View Wine Pairing')
      this.$button.removeClass('disabled')
    }
  }
}

export default ProductPairingButtonView;