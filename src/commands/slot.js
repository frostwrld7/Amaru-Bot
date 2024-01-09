/* eslint-disable no-unused-vars */
import {
  MsgCommand
} from '../structures/msgcommands.js'
const slots = ['🍎', '🍊', '🍇', '🍒', '🍋']

export default new MsgCommand({
  name: 'slot',
  description: 'Permet de voir les membres dans une team.',
  userPermssions: 'EVERYONE',
  commandCategory: 'INFORMATIONS',

  /**
   * @param { { commands: Collection, events: Collection, db: QuickDB} & Client } client
   * @param { CommandInteraction } interaction
   */

  async callback (client, message, args) {
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
    const slot1 = slots[Math.floor(Math.random() * slots.length)]
    const slot2 = slots[Math.floor(Math.random() * slots.length)]
    const slot3 = slots[Math.floor(Math.random() * slots.length)]

    if (slot1 === slot2 && slot2 === slot3) {
      const points = Math.floor(Math.random() * 50) + 1
      const allpointsofmemberget = await client.db2.get(`points_${message.member.user.id}_${message.guild.id}`)
      let allpointsofmember
      if (isNaN(parseInt(allpointsofmemberget))) {
        allpointsofmember = 0
      } else {
        allpointsofmember = parseInt(allpointsofmemberget)
      }
      await client.db2.set(`points_${message.member.user.id}_${message.guild.id}`, allpointsofmember + points)
      message.channel.send(`Bravo, vous avez gagné pour les slots suivant --> ${slot1}, ${slot2} et ${slot3}\nVous gagnez donc **${points}** points pour votre team.`)
      await client.db.set(`${player1team}_${message.guild.id}`, {
        points: parseInt(team.points) + points,
        leader: [...team.leader, {
          member: message.member.user.id,
          points: allpointsofmember + points
        }],
        trophees: team?.trophees
      })
    } else {
      message.channel.send(`Dommage ! Tu as perdu ! Les symboles étaient ${slot1} ${slot2} ${slot3}`)
    }
  }
})
