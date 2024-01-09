/* eslint-disable no-unused-expressions */
import {
  Client,
  Collection
} from 'discord.js'
import {
  readdirSync
} from 'fs'
import {
  dirname,
  join
} from 'path'
import {
  QuickDB
} from 'quick.db'
import {
  fileURLToPath
} from 'url'
import {
  Player
} from 'discord-player'
import {
  PlayerEvents
} from './player.js'

export class ExtandedClient extends Client {
  constructor ({
    clientOptions,
    clientToken,
    eventDir,
    commandDir
  }) {
    super(clientOptions)

    this.events = new Collection()
    this.commands = new Collection()
    this.msgcommands = new Collection()
    this.db = new QuickDB({
      filePath: 'db.sqlite'
    })
    this.db2 = new QuickDB({
      filePath: 'points.sqlite'
    })
    this.player = new Player(this)
    PlayerEvents(this.player)
    this.#init({
      token: clientToken,
      commandDir,
      eventDir
    })
  }

  async #init ({
    token,
    commandDir,
    eventDir
  }) {
    await this.#eventsInit(eventDir)
    await this.#commandsInit(commandDir)
    await this.login(token)
  }

  async #commandsInit (commandDir) {
    readdirSync(join(dirname(fileURLToPath(
      import.meta.url)), commandDir)).filter(async file => {
      file ? file.endsWith('.js') ? (await import(commandDir + file))?.default : null : null
    })
  }

  async #eventsInit (eventDir) {
    readdirSync(join(dirname(fileURLToPath(
      import.meta.url)), eventDir)).filter(async file => {
      file ? file.endsWith('.js') ? (await import(eventDir + file))?.default : null : null
    })
  }
}
