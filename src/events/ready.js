import {
  REST
} from '@discordjs/rest'
import {
  Routes
} from 'discord-api-types/v9'
import {
  Evenement
} from '../structures/evenements.js'
import cron from 'cron'
import {
  EmbedBuilder
} from 'discord.js'

export default new Evenement({
  eventName: {
    ready: 0
  },

  /**
   * @param { { commands: Collection, events: Collection } & Client } client
   */

  async callback (client) {
    process.on('unhandledRejection', async () => {

    })
    process.on('uncaughtException', async () => {

    })
    async function sendMessage () {
      const channelId = '1084310097716584520'
      const guildId = '1084310096558952541'
      const channel = client.channels.cache.get(channelId)
      const guild = client.guilds.cache.get(guildId)
      const [cafardsinformations, ratsinformations, crapaudsinformations] = await Promise.all([
        await client.db.get(`cafards_${guild.id}`),
        await client.db.get(`rats_${guild.id}`),
        await client.db.get(`crapauds_${guild.id}`)
      ])
      const teams = [{
        name: 'cafards',
        points: cafardsinformations.points,
        leader: [...cafardsinformations.leader],
        trophees: cafardsinformations.trophees
      },
      {
        name: 'rats',
        points: ratsinformations.points,
        leader: [...ratsinformations.leader],
        trophees: ratsinformations.trophees
      },
      {
        name: 'crapauds',
        points: crapaudsinformations.points,
        leader: [...crapaudsinformations.leader],
        trophees: crapaudsinformations.trophees
      }
      ]
      teams.sort((a, b) => b.points - a.points)
      const winner = teams[0]
      await client.db.set(`cafards_${guild.id}`, {
        points: 0,
        leader: [],
        trophees: cafardsinformations.trophees
      })
      await client.db.set(`rats_${guild.id}`, {
        points: 0,
        leader: [],
        trophees: ratsinformations.trophees
      })
      await client.db.set(`crapauds_${guild.id}`, {
        points: 0,
        leader: [],
        trophees: crapaudsinformations.trophees
      })
      await client.db.set(`${winner.name}_${guild.id}`, {
        points: 0,
        leader: [],
        trophees: parseInt(winner.trophees) + 1
      })
      await client.db2.deleteAll()
      const finalLeader = winner.leader.sort((a, b) => b.points - a.points)
      const embed = new EmbedBuilder()
        .setTitle('Gagnant de la semaine')
        .setColor('#FF0000')
        .setDescription(`**Le gagnant de cette semaine est donc la team des** **\`${winner.name}\`** **!!!**\nVous gagnez donc un trophée de plus dans votre collection !\nVous possédez actuellement **${parseInt(winner.trophees) + 1}** trophées\nLa team des **${winner.name}** peut dire un grand merci à ${guild.members.cache.get(finalLeader[0]?.member)?.user?.tag} qui est le leader de points de la team.`)
      await channel.send({
        embeds: [embed]
      })
    }
    console.log(`Prêt sur ${client.user.tag}`)
    const task = cron.job('0 0 * * 0', async () => {
      await sendMessage()
    })

    task.start()
    const rest = new REST({
      version: '9'
    }).setToken(client.token)
    client.guilds.cache.forEach(guild => {
      (async () => {
        try {
          const commands = []
          client.commands.forEach(commandOptions => {
            commands.push(commandOptions)
          })
          await rest.put(
            Routes.applicationGuildCommands(client.user.id, guild.id), {
              body: commands
            }
          )
        } catch (error) {
          console.error(error)
        }
      })()
    })
  }
})
