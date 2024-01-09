import { MsgCommand } from '../structures/msgcommands.js'
import { QueueRepeatMode } from 'discord-player'

export default new MsgCommand(
  {
    name: 'loop',
    description: 'Permet de répéter une musique en cours.',
    userPermssions: 'EVERYONE',
    commandCategory: 'INFORMATIONS',

    /**
         * @param { { commands: Collection, events: Collection, db: QuickDB } & Client } client
         * @param { Message } message
         * @param { String[] } args
        */

    async callback (client, message, args) {
      if (!message.member.voice.channel && message.guild.members.me.voice.channel) return message.reply({ content: "Veuillez d'abord rejoindre un salon vocal." })
      if (!message.member.voice.channel.permissionsFor(client.user).has('CONNECT')) return message.reply({ content: 'Je ne peux pas me connecter à votre salon vocal.' })
      if (!message.member.voice.channel.permissionsFor(client.user).has('SPEAK')) return message.reply({ content: 'Je ne peux pas parler dans votre salon vocal.' })
      const mode = args[0]
      if (!mode) {
        return message.reply({ content: 'Veuillez préciser `on` ou `off`.' })
      }
      const queue = client.player.nodes.get(message.guild.id)
      if (!queue || !queue.node.isPlaying()) return message.reply({ content: 'Aucune musique n\'est jouée actuellement.' })
      const currentTrack = queue.node.queue.currentTrack
      if (mode === 'on') {
        queue.node.queue.setRepeatMode(QueueRepeatMode.TRACK)
        return message.reply({
          content: `La musique **\`${currentTrack}\`** a été mis en mode répétition.`
        })
      } else {
        queue.node.queue.setRepeatMode(QueueRepeatMode.OFF)
        return message.reply({
          content: `La musique **\`${currentTrack}\`** a été enlevé du mode répétition.`
        })
      }
    }
  }
)
