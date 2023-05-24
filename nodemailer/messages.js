const messages = {
  invoice: {
    created: {
      subject: 'Nova comanda creada per {{user}}.',
      text: 'Pots veure la comanda a {{url}}.'
    },
    status: {
      subject: 'Una comanda ha canviat d\'estat: {{status}}',
      text: 'La comanda de {{user}} ha canviat a {{status}}.\nPots veure-la a {{url}}.'
    },
    received: {
      subject: 'S\'ha rebut una comanda.',
      text: 'Una comanda de {{user}} s\'ha rebut.\nLa pots veure a {{url}}.'
    },
    modified: {
      subject: 'Una comanda s\'ha modificat.',
      text: ''
    }
  },
}

module.exports = { messages };