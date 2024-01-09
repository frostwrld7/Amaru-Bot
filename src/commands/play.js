import { MsgCommand } from '../structures/msgcommands.js'
import { QueryType } from 'discord-player'

export default new MsgCommand(
  {
    name: 'play',
    description: 'Permet de jouer une musique avec le bot.',
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
      if (!args.slice(1).join(' ')) return message.reply({ content: 'Veuillez préciser quelle musique vous souhaitez jouer.' })
      const zik = args.slice(1).join(' ')
      const music = await client.player.search(zik, {
        requestedBy: message.author,
        searchEngine: QueryType.YOUTUBE_SEARCH
      })
      if (!music) return message.reply({ content: 'Musique non trouvée.' })

      const queue = client.player.nodes.create(message.guild, {
        metadata: {
          channel: message.channel,
          client: message.guild.members.me,
          requestedBy: message.author
        },
        autoSelfDeaf: true,
        initialVolume: 80,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 300000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 300000
      })
      queue.addTrack(music.tracks[0])
      if (!queue.connection) await queue.connect(message.member.voice.channel)
      if (!queue.isPlaying()) await queue.node.play().catch(err => console.log(err))
    }
  }
)
