import { MsgCommand } from '../structures/msgcommands.js'

export default new MsgCommand(
  {
    name: 'skip',
    description: 'Permet de passer une musique avec le bot.',
    userPermssions: 'EVERYONE',
    commandCategory: 'INFORMATIONS',

    /**
         * @param { { commands: Collection, events: Collection, db: QuickDB } & Client } client
         * @param { Message } message
         * @param { String[] } args
        */

    async callback (client, message, args) {
      if (!message.member.voice?.channel && message.guild.members.me.voice?.channel) return message.reply({ content: 'Veuillez d\'abord rejoindre un salon vocal.' })
      if (!message.member.voice?.channel?.permissionsFor(client.user)?.has('CONNECT')) return message.reply({ content: 'Je ne peux pas me connecter à votre salon vocal.' })
      if (!message.member.voice?.channel?.permissionsFor(client.user)?.has('SPEAK')) return message.reply({ content: 'Je ne peux pas parler dans votre salon vocal.' })
      const queue = client.player.nodes.get(message.guild.id)
      if (!queue || !queue.node.isPlaying()) return message.reply({ content: 'Aucune musique n\'est jouée actuellement.' })
      const currentTrack = queue.node.queue.currentTrack
      const success = queue.node.skip()
      return message.reply({
        content: success ? `La musique **\`${currentTrack}\`** a été skip.` : 'Erreur, veuillez réessayer.'
      })
    }
  }
)
