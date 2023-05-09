const messages = {
  invoice: {
    created: {
      subject: 'Nova comanda creada per {{user}}.',
      text: 'Pots veure la comanda a {{url}}.'
    },
    statusChange: {
      subject: 'Una comanda ha canviat d\'estat: {{status}}',
      text: 'La comanda de {{user}} ha canviat a {{status}}.\nPots veure-la a {{url}}.'
    },
    received: {
      subject: 'Una comanda s\'ha rebut',
      text: 'La comanda de {{user}} s\'ha rebut.'
    },
  },
}

module.exports = { messages };