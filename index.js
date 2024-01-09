import { ExtandedClient } from './src/structures/client.js'

export const EXTANDED_CLIENT = new ExtandedClient(
  {
    eventDir: '../events/',
    commandDir: '../commands/',
    clientToken: 'OTUyMjExNTk1MDI5Nzk0ODU2.GqFUoL.8Abq9gWcpyg9dJDkAWnSoHuFK_9a6ujq3UM9rI',
    clientOptions: { intents: 3276799, presence: { activities: [{ type: 'WATCHING', name: 'Choisissez votre maison' }] } }
  }
)
