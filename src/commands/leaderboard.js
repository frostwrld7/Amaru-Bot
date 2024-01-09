/* eslint-disable no-undef */
import {
  EmbedBuilder
} from 'discord.js'
import {
  MsgCommand
} from '../structures/msgcommands.js'

export default new MsgCommand({
  name: 'classement',
  description: 'Permet de passer une musique avec le bot.',
  userPermssions: 'EVERYONE',
  commandCategory: 'INFORMATIONS',

  /**
   * @param { { commands: Collection, events: Collection, db: QuickDB } & Client } client
   * @param { Message } message
   * @param { String[] } args
   */

  async callback (client, message, args) {
    const [cafardsinformations, ratsinformations, crapaudsinformations] = await Promise.all([
      await client.db.get(`cafards_${message.guild.id}`),
      await client.db.get(`rats_${message.guild.id}`),
      await client.db.get(`crapauds_${message.guild.id}`)
    ])
    if (!cafardsinformations) {
      await client.db.set(`cafards_${message.guild.id}`, {
        points: 0,
        leader: [],
        trophees: 0
      })
    }
    if (!ratsinformations) {
      await client.db.set(`rats_${message.guild.id}`, {
        points: 0,
        leader: [],
        trophees: 0
      })
    }
    if (!crapaudsinformations) {
      await client.db.set(`crapauds_${message.guild.id}`, {
        points: 0,
        leader: [],
        trophees: 0
      })
    }
    const teams = [{
      name: 'Cafard',
      points: cafardsinformations.points,
      leader: [...cafardsinformations.leader],
      trophees: cafardsinformations.trophees
    },
    {
      name: 'Rat',
      points: ratsinformations.points,
      leader: [...ratsinformations.leader],
      trophees: ratsinformations.trophees
    },
    {
      name: 'Crapaud',
      points: crapaudsinformations.points,
      leader: [...crapaudsinformations.leader],
      trophees: crapaudsinformations.trophees
    }
    ]
    const embed = new EmbedBuilder()
      .setTitle('Classement des teams')
      .setColor('#FF0000')
    teams.sort((a, b) => b.points - a.points)
    teams.forEach((team) => {
      const finalLeader = team.leader.sort((a, b) => b.points - a.points)
      embed.addFields([{
        name: `Nom : ${team.name}`,
        value: `Points : **${team.points}** points\nLeader de points : **${message.guild.members.cache.get(finalLeader[0]?.member)?.user?.tag || 'Aucun leader'}** avec **${finalLeader[0]?.points || '0'}** points\nTrophées : ${team.trophees}`,
        inline: false
      }])
    })
    await message.channel.send({
      embeds: [embed]
    })
  }
})
