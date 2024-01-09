/* eslint-disable no-undef */
import { EXTANDED_CLIENT } from '../../index.js'

export class Command {
  /**
    * @param { { ?userPermssions: import("discord.js").PermissionResolvable, callback: Function, commandCategory: 'CHAT' | 'MODERATION' | 'PROTECTION' } & import("discord.js").ChatInputApplicationCommandData} commandOptions
    */

  constructor (commandOptions = { userPermssions, commandCategory, callback }) {
    EXTANDED_CLIENT.commands.set(commandOptions.name, commandOptions)
  }
}
