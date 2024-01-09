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
  name: 'teams',
  description: 'Permet de voir les membres dans une team.',
  slash: 'non',
  options: [{
    name: 'team',
    description: 'Veuillez sélectionner la team à laquelle vous souhaitez voir les membres',
    required: true,
    type: 3,
    choices: [{
      name: 'crapaud',
      value: 'crapaud'
    },
    {
      name: 'rat',
      value: 'rat'
    },
    {
      name: 'cafard',
      value: 'cafard'
    },
    {
      name: 'batard',
      value: 'batard'
    }
    ]
  }],
  userPermssions: 'EVERYONE',
  commandCategory: 'INFORMATIONS',

  /**
   * @param { { commands: Collection, events: Collection, db: QuickDB} & Client } client
   * @param { CommandInteraction } interaction
   */

  async callback (client, interaction) {
    const roleid = await client.db.get(`roleteama_${interaction.guild.id}`)
    const roleeid = await client.db.get(`roleteamb_${interaction.guild.id}`)
    const roleeeid = await client.db.get(`roleteamc_${interaction.guild.id}`)
    const roleeeeid = await client.db.get(`roleteamd_${interaction.guild.id}`)
    const role = interaction.guild.roles.cache.find(role => role.id === roleid)
    const rolee = interaction.guild.roles.cache.find(role => role.id === roleeid)
    const roleee = interaction.guild.roles.cache.find(role => role.id === roleeeid)
    const roleeee = interaction.guild.roles.cache.find(role => role.id === roleeeeid)
    const choix = interaction.options.get('team').value

    if (choix === 'cafard') {
      const memberss = role.members
      const members = []
      memberss.forEach(m => {
        members.push(m)
      })
      let memberList = ''
      members.forEach((member, i) => {
        memberList += `${i + 1}. ${member.user.tag}\n`
      })
      const pageSize = 10
      const lines = memberList.match(/[^\r\n]+/g)
      const pages = []
      while (lines.length > 0) {
        pages.push(lines.splice(0, pageSize).join('\n'))
      }

      let currentPage = 0

      const embed = new EmbedBuilder()
        .setTitle('Membres dans la team Cafard')
        .setColor('#2F3136')
        .setDescription(`${pages[currentPage]}`)
        .setFooter({
          text: `Page ${currentPage + 1}/${pages.length}`
        })

      const previousButton = new ButtonBuilder()
        .setEmoji('◀️')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('previous')

      const nextButton = new ButtonBuilder()
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('next')

      const row = new ActionRowBuilder().addComponents(previousButton, nextButton)

      const message = await interaction.reply({
        embeds: [embed],
        components: [row]
      })

      const filter = (int) => int.user.id === interaction.user.id
      const collector = message.createMessageComponentCollector({
        filter,
        time: 360000
      })

      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'previous') {
          currentPage--
          if (currentPage < 0) {
            currentPage = pages.length - 1
          }
        } else if (interaction.customId === 'next') {
          currentPage++
          if (currentPage === pages.length) {
            currentPage = 0
          }
        }

        const newEmbed = new EmbedBuilder()
          .setTitle('Membres dans la team Cafard')
          .setColor('#2F3136')
          .setDescription(pages[currentPage])
          .setFooter({
            text: `Page ${currentPage + 1}/${pages.length}`
          })

        await interaction.update({
          embeds: [newEmbed]
        })
      })

      collector.on('end', async () => {
        const disabledRow = new ActionRowBuilder().addComponents(
          previousButton.setDisabled(true),
          nextButton.setDisabled(true)
        )

        const finalEmbed = new EmbedBuilder()
          .setTitle('Liste expirée')
          .setColor('#2F3136')

        await message.edit({
          embeds: [finalEmbed],
          components: [disabledRow]
        })
      })
    }

    if (choix === 'rat') {
      const memberss = rolee.members
      const members = []
      memberss.forEach(m => {
        members.push(m)
      })
      let memberList = ''
      members.forEach((member, i) => {
        memberList += `${i + 1}. ${member.user.tag}\n`
      })
      const pageSize = 10
      const lines = memberList.match(/[^\r\n]+/g)
      const pages = []
      while (lines.length > 0) {
        pages.push(lines.splice(0, pageSize).join('\n'))
      }

      let currentPage = 0

      const embed = new EmbedBuilder()
        .setTitle('Membres dans la team Rat')
        .setColor('#2F3136')
        .setDescription(`${pages[currentPage]}`)
        .setFooter({
          text: `Page ${currentPage + 1}/${pages.length}`
        })

      const previousButton = new ButtonBuilder()
        .setEmoji('◀️')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('previous')

      const nextButton = new ButtonBuilder()
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('next')

      const row = new ActionRowBuilder().addComponents(previousButton, nextButton)

      const message = await interaction.reply({
        embeds: [embed],
        components: [row]
      })

      const filter = (int) => int.user.id === interaction.user.id
      const collector = message.createMessageComponentCollector({
        filter,
        time: 360000
      })

      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'previous') {
          currentPage--
          if (currentPage < 0) {
            currentPage = pages.length - 1
          }
        } else if (interaction.customId === 'next') {
          currentPage++
          if (currentPage === pages.length) {
            currentPage = 0
          }
        }

        const newEmbed = new EmbedBuilder()
          .setTitle('Membres dans la team Rat')
          .setColor('#2F3136')
          .setDescription(pages[currentPage])
          .setFooter({
            text: `Page ${currentPage + 1}/${pages.length}`
          })

        await interaction.update({
          embeds: [newEmbed]
        })
      })

      collector.on('end', async () => {
        const disabledRow = new ActionRowBuilder().addComponents(
          previousButton.setDisabled(true),
          nextButton.setDisabled(true)
        )

        const finalEmbed = new EmbedBuilder()
          .setTitle('Liste expirée')
          .setColor('#2F3136')

        await message.edit({
          embeds: [finalEmbed],
          components: [disabledRow]
        })
      })
    }

    if (choix === 'crapaud') {
      const memberss = roleee.members
      const members = []
      memberss.forEach(m => {
        members.push(m)
      })
      let memberList = ''
      members.forEach((member, i) => {
        memberList += `${i + 1}. ${member.user.tag}\n`
      })
      const pageSize = 10
      const lines = memberList.match(/[^\r\n]+/g)
      const pages = []
      while (lines.length > 0) {
        pages.push(lines.splice(0, pageSize).join('\n'))
      }

      let currentPage = 0

      const embed = new EmbedBuilder()
        .setTitle('Membres dans la team Crapaud')
        .setColor('#2F3136')
        .setDescription(`${pages[currentPage]}`)
        .setFooter({
          text: `Page ${currentPage + 1}/${pages.length}`
        })

      const previousButton = new ButtonBuilder()
        .setEmoji('◀️')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('previous')

      const nextButton = new ButtonBuilder()
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('next')

      const row = new ActionRowBuilder().addComponents(previousButton, nextButton)

      const message = await interaction.reply({
        embeds: [embed],
        components: [row]
      })

      const filter = (int) => int.user.id === interaction.user.id
      const collector = message.createMessageComponentCollector({
        filter,
        time: 360000
      })

      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'previous') {
          currentPage--
          if (currentPage < 0) {
            currentPage = pages.length - 1
          }
        } else if (interaction.customId === 'next') {
          currentPage++
          if (currentPage === pages.length) {
            currentPage = 0
          }
        }

        const newEmbed = new EmbedBuilder()
          .setTitle('Membres dans la team Crapaud')
          .setColor('#2F3136')
          .setDescription(pages[currentPage])
          .setFooter({
            text: `Page ${currentPage + 1}/${pages.length}`
          })

        await interaction.update({
          embeds: [newEmbed]
        })
      })

      collector.on('end', async () => {
        const disabledRow = new ActionRowBuilder().addComponents(
          previousButton.setDisabled(true),
          nextButton.setDisabled(true)
        )

        const finalEmbed = new EmbedBuilder()
          .setTitle('Liste expirée')
          .setColor('#2F3136')

        await message.edit({
          embeds: [finalEmbed],
          components: [disabledRow]
        })
      })
    }

    if (choix === 'batard') {
      const memberss = roleeee.members
      const members = []
      memberss.forEach(m => {
        members.push(m)
      })
      let memberList = ''
      members.forEach((member, i) => {
        memberList += `${i + 1}. ${member.user.tag}\n`
      })
      const pageSize = 10
      const lines = memberList.match(/[^\r\n]+/g)
      const pages = []
      while (lines.length > 0) {
        pages.push(lines.splice(0, pageSize).join('\n'))
      }

      let currentPage = 0

      const embed = new EmbedBuilder()
        .setTitle('Membres dans la team Bâtard')
        .setColor('#2F3136')
        .setDescription(`${pages[currentPage]}`)
        .setFooter({
          text: `Page ${currentPage + 1}/${pages.length}`
        })

      const previousButton = new ButtonBuilder()
        .setEmoji('◀️')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('previous')

      const nextButton = new ButtonBuilder()
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('next')

      const row = new ActionRowBuilder().addComponents(previousButton, nextButton)

      const message = await interaction.reply({
        embeds: [embed],
        components: [row]
      })

      const filter = (int) => int.user.id === interaction.user.id
      const collector = message.createMessageComponentCollector({
        filter,
        time: 360000
      })

      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'previous') {
          currentPage--
          if (currentPage < 0) {
            currentPage = pages.length - 1
          }
        } else if (interaction.customId === 'next') {
          currentPage++
          if (currentPage === pages.length) {
            currentPage = 0
          }
        }

        const newEmbed = new EmbedBuilder()
          .setTitle('Membres dans la team Bâtard')
          .setColor('#2F3136')
          .setDescription(pages[currentPage])
          .setFooter({
            text: `Page ${currentPage + 1}/${pages.length}`
          })

        await interaction.update({
          embeds: [newEmbed]
        })
      })

      collector.on('end', async () => {
        const disabledRow = new ActionRowBuilder().addComponents(
          previousButton.setDisabled(true),
          nextButton.setDisabled(true)
        )

        const finalEmbed = new EmbedBuilder()
          .setTitle('Liste expirée')
          .setColor('#2F3136')

        await message.edit({
          embeds: [finalEmbed],
          components: [disabledRow]
        })
      })
    }
  }
})
