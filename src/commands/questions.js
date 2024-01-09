/* eslint-disable no-useless-escape */
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js'
import {
  Command
} from '../structures/commands.js'

export default new Command({
  name: 'questions',
  description: 'Permet d\'envoyer le panel du test de personnalité.',
  options: [],
  slash: 'non',
  userPermssions: 'EVERYONE',
  commandCategory: 'INFORMATIONS',

  /**
   * @param { { commands: Collection, events: Collection, db: QuickDB } & Client } client
   * @param { CommandInteraction } interaction
   */

  async callback (client, interaction) {
    const team = await client.db.get(`roleteama_${interaction.guild.id}`)
    if (!interaction.guild.roles.cache.get(team)) {
      return interaction.reply({
        content: 'Veuillez d\'abord définir les rôles des teams avec la commande : **\`/setrole\`**.'
      })
    }
    const panel = new EmbedBuilder()
      .setTitle('Panel de test de personnalité')
      .setDescription('Afin de commencer à répondre aux questions et de tester votre personnalité, cliquez sur le bouton en dessous.')
      .setColor('#2F3136')

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('questions')
          .setStyle(ButtonStyle.Success)
          .setLabel('Commencer')
      )

    return interaction.reply({
      embeds: [panel],
      components: [row]
    })
  }
})
