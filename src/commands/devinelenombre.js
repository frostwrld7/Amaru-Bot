/* eslint-disable no-unused-vars */
import { MsgCommand } from '../structures/msgcommands.js'

export default new MsgCommand(
  {
    name: 'dvn',
    description: 'Permet de voir les membres dans une team.',
    userPermssions: 'EVERYONE',
    commandCategory: 'INFORMATIONS',

    /**
         * @param { { commands: Collection, events: Collection, db: QuickDB} & Client } client
         * @param { CommandInteraction } interaction
        */

    async callback (client, message) {
      let attempt = 0
      const maxAttempts = 10
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
      const nombreAleatoire = Math.floor(Math.random() * 100) + 1
      await message.channel.send('Je pense à un nombre entre 1 et 100. Devinez quel est ce nombre !')

      const filter = m => m.author.id === message.author.id
      const collector = message.channel.createMessageCollector({ filter, time: 120000 })

      collector.on('collect', async m => {
        const reponse = parseInt(m.content)
        if (reponse === nombreAleatoire) {
          try {
            const points = Math.floor(Math.random() * 100) + 1
            collector.stop()
            const allpointsofmemberget = await client.db2.get(`points_${message.member.user.id}_${message.guild.id}`)
            let allpointsofmember
            if (isNaN(parseInt(allpointsofmemberget))) {
              allpointsofmember = 0
            } else {
              allpointsofmember = parseInt(allpointsofmemberget)
            }
            await client.db2.set(`points_${message.member.user.id}_${message.guild.id}`, allpointsofmember + points)
            message.channel.send(`Bravo, vous avez deviné le nombre !\nVous gagnez donc **${points}** points pour votre team.`)
            await client.db.set(`${player1team}_${message.guild.id}`, {
              points: parseInt(team.points) + points,
              leader: [...team.leader, { member: message.member.user.id, points: allpointsofmember + points }],
              trophees: team?.trophees
            })
          } catch (error) {
            console.log(error)
          }
        } else {
          if (attempt >= maxAttempts) {
            collector.stop()
            message.channel.send(`Désolé, le nombre était ${nombreAleatoire}. Essayez encore !`)
          } else {
            attempt++
            message.channel.send(`Mauvaise réponse, il vous reste **${maxAttempts - attempt}** essais.\nC'est **${reponse > nombreAleatoire ? 'moins' : 'plus'}**.`)
          }
        }
      })
    }
  })
