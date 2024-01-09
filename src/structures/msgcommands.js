/* eslint-disable no-undef */
import { EXTANDED_CLIENT } from '../../index.js'

export class MsgCommand {
  /**
   * @param {{
   *  userPermssions: import("discord.js").PermissionResolvable,
    *  commandCategory: 'CHAT' | 'MODERATION' | 'PROTECTION',
    *  callback: Function
    * } & import("discord.js").ChatInputApplicationCommandData} commandOptions
    */
  constructor (commandOptions = { userPermssions, commandCategory, callback }) {
    EXTANDED_CLIENT.msgcommands.set(commandOptions.name, commandOptions)
  }
}
