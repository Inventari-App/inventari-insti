export interface Message {
  subject: string;
  text: string;
}

export interface Messages {
  [key: string]: {
    [value: string]: Message;
  };
}

const messages: Messages = {
  user: {
    verify: {
      subject: 'Activa el teu usuari.',
      text: 'Pots activar el teu usuari anant a {{url}} .\nRecorda que tens 10 minuts per fer-ho.'
    },
    reset: {
      subject: 'Restableix la teva contrasenya.',
      text: 'Pots restablir la teva contrasenya anant a {{url}} .\nRecorda que tens 1 hora per fer-ho.'
    }
  },
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
      text: 'Una comanda de {{user}} ha estat modificada.\nLa pots veure a {{url}}.'
    }
  },
}

export { messages };
