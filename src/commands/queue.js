import { MsgCommand } from '../structures/msgcommands.js'
import { EmbedBuilder } from 'discord.js'

export default new MsgCommand(
  {
    name: 'queue',
    description: 'Permet de voir la liste des musique dans la file d\'attente.',
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
      if (!client.player.nodes.get(message.guild) || !client.player.nodes.get(message.guild).isPlaying()) return message.reply({ content: "Aucune musique n'est en attente." })
      const all = client.player.nodes.get(message.guild).tracks?.map((t, i) => {
        return `${i + 1}. ${t.title} par ${t.author}`
      })
      const embed = new EmbedBuilder()
        .setTitle("File d'Attente")
        .setDescription(`${all.join('\n') || 'Aucune musique'}`)
        .setColor('#2F3136')
      return message.reply({ embeds: [embed] })
    }
  }
)
