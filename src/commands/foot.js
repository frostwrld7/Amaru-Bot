/* eslint-disable no-unused-vars */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} from 'discord.js'
import {
  MsgCommand
} from '../structures/msgcommands.js'
let inGame

export default new MsgCommand({
  name: 'foot',
  description: 'Permet de voir les membres dans une team.',
  userPermssions: 'EVERYONE',
  commandCategory: 'INFORMATIONS',

  /**
   * @param { { commands: Collection, events: Collection, db: QuickDB} & Client } client
   * @param { CommandInteraction } interaction
   */

  async callback (client, message, args) {
    if (inGame) return message.reply('Une partie est déjà en cours.')
    inGame = true
    let player1team
    const teambatard = await client.db.get(`roleteamd_${message.guild.id}`)
    if (message.member.roles.cache.find(r => r.id === teambatard)) return message.channel.send('Vous ne pouvez pas jouer car vous êtes un batard.')
    const teamrat = await client.db.get(`roleteamb_${message.guild.id}`)
    const teamcafard = await client.db.get(`roleteama_${message.guild.id}`)
    const teamcrapaud = await client.db.get(`roleteamc_${message.guild.id}`)
    if (message.member.roles.cache.find(r => r.id === teamrat)) player1team = 'rats'
    if (message.member.roles.cache.find(r => r.id === teamcafard)) player1team = 'cafards'
    if (message.member.roles.cache.find(r => r.id === teamcrapaud)) player1team = 'crapauds'
    const team = await client.db.get(`${player1team}_${message.guild.id}`)
    const positions = {
      left: '_ _                   :goal::goal::goal:\n_ _                   :levitate:\n      \n_ _                         :soccer:',
      middle: '_ _                   :goal::goal::goal:\n_ _                        :levitate:\n      \n_ _                         :soccer:',
      right: '_ _                   :goal::goal::goal:\n_ _                              :levitate:\n      \n_ _                         :soccer:'
    }
    let randomized = Math.floor(Math.random() * Object.keys(positions).length)
    let gameEnded = false
    let randomPos = positions[Object.keys(positions)[randomized]]
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('left')
          .setLabel('Gauche')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('middle')
          .setLabel('Milieu')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('right')
          .setLabel('Droite')
          .setStyle(ButtonStyle.Secondary)
      )
    const msg = await message.channel.send({
      content: `${randomPos}`,
      components: [row]
    })
    async function update () {
      randomized = Math.floor(Math.random() * Object.keys(positions).length)
      randomPos = positions[Object.keys(positions)[randomized]]

      await msg.edit({
        content: randomPos,
        components: [row]
      })
    }
    setInterval(() => {
      if (!gameEnded) return update()
    }, 500)
    const filter = button => {
      return button.user.id === message.author.id
    }
    await msg.awaitMessageComponent({
      filter,
      componentType: ComponentType.Button,
      max: 1,
      time: 60000
    }).then(async button => {
      if (button.customId !== Object.keys(positions)[randomized]) {
        gameEnded = true
        const points = Math.floor(Math.random() * 8) + 1
        const allpointsofmemberget = await client.db2.get(`points_${message.member.user.id}_${message.guild.id}`)
        let allpointsofmember
        if (isNaN(parseInt(allpointsofmemberget))) {
          allpointsofmember = 0
        } else {
          allpointsofmember = parseInt(allpointsofmemberget)
        }
        await client.db2.set(`points_${message.member.user.id}_${message.guild.id}`, allpointsofmember + points)
        await client.db.set(`${player1team}_${message.guild.id}`, {
          points: parseInt(team.points) + points,
          leader: [...team.leader, {
            member: message.member.user.id,
            points: allpointsofmember + points
          }],
          trophees: team?.trophees
        })
        inGame = false
        return button.reply({
          content: `Tu as **marqué**.\nTu gagnes donc **${points}** points pour ta team.`
        })
      } else {
        inGame = false
        gameEnded = true
        return button.reply({
          content: 'Tu as perdu.'
        })
      }
    }).catch(err => {
      console.log(err)
      message.channel.send('Partie annulée.')
      inGame = false
    })
  }
})
