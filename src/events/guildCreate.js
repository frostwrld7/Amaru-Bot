import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { Evenement } from '../structures/evenements.js'

export default new Evenement(
  {
    eventName: { guildCreate: 0 },

    /**
         * @param { Guild } guild
         * @param { { commands: Collection, events: Collection } & Client } client
        */

    async callback (client, guild) {
      const rest = new REST({ version: '9' }).setToken(client.token);
      (async () => {
        try {
          const commands = []
          client.commands.forEach(commandOptions => {
            if (commandOptions.slash === 'non') return
            commands.push(commandOptions)
          })
          await rest.put(
            Routes.applicationGuildCommands(client.user.id, guild.id),
            { body: commands }
          )
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }
)
