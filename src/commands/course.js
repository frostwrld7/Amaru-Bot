/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import {
  MsgCommand
} from '../structures/msgcommands.js'
const trackLength = 20
let inGame
const animals = [{
  name: 'Cheval',
  emoji: ':horse:',
  speed: Math.floor(Math.random() * 3) + 1
},
{
  name: 'Lion',
  emoji: ':lion_face:',
  speed: Math.floor(Math.random() * 3) + 1
},
{
  name: 'Tortue',
  emoji: ':turtle:',
  speed: Math.floor(Math.random() * 3) + 1
},
{
  name: 'Renard',
  emoji: '🦊',
  speed: Math.floor(Math.random() * 3) + 1
},
{
  name: 'Tigre',
  emoji: '🐯',
  speed: Math.floor(Math.random() * 3) + 1
},
{
  name: 'Aigle',
  emoji: '🦅',
  speed: Math.floor(Math.random() * 3) + 1
},
{
  name: 'Loup',
  emoji: '🐺',
  speed: Math.floor(Math.random() * 3) + 1
}
]

export default new MsgCommand({
  name: 'course',
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
    message.channel.send('Une course d\'animaux va commencer ! Quel est votre pari ? ( Choisissez le numéro )\n\n' +
      animals.map((animal, index) => `${index + 1}. ${animal.name} ${animal.emoji}`).join('\n'))

    const filter = m => m.author.id === message.author.id && !isNaN(m.content) && m.content >= 1 && m.content <= animals.length
    const collector = message.channel.createMessageCollector(filter, {
      max: 1,
      time: 20000
    })

    collector.on('collect', async m => {
      const animal = animals[m.content - 1]
      await message.channel.send(`Vous avez choisi ${animal.name} ${animal.emoji} comme votre pari !`)

      const mess = await message.channel.send('...')

      const positions = Array(animals.length).fill(0)
      let winner = null

      while (winner === null) {
        animals.forEach(infos => {
          infos.speed = Math.floor(Math.random() * 3) + 1
        })
        for (let i = 0; i < animals.length; i++) {
          positions[i] += animals[i].speed

          if (positions[i] >= trackLength) {
            winner = animals[i]
            break
          }
        }

        const track = await Promise.all(positions.map(async (position, index) => {
          const animal = animals[index]
          const distance = Math.min(position, trackLength)
          return `${animal.name} ${animal.emoji} : ${'🟩'.repeat(distance)}${'⬜️'.repeat(trackLength - distance)}`
        }))
        await new Promise(resolve => setTimeout(resolve, 2000))
        await mess.edit(track.join('\n')).catch(err => console.log(err))

        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      await collector.stop()
      if (animal.name === winner.name) {
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
        message.channel.send(`Bravo, vous avez gagné votre prédiction pour ${winner.name} --> ${winner.emoji} !\nVous gagnez donc **${points}** points pour votre team.`)
        await client.db.set(`${player1team}_${message.guild.id}`, {
          points: parseInt(team.points) + points,
          leader: [...team.leader, {
            member: message.member.user.id,
            points: allpointsofmember + points
          }],
          trophees: team?.trophees
        })
        inGame = false
      }
      inGame = false
      return await message.channel.send(`Vous avez perdu votre prédiction\nLe gagnant est ${winner.name} --> ${winner.emoji} !`)
    })
    collector.on('end', collected => {
      if (collected.size === 0) {
        message.channel.send('Temps écoulé, la course est annulée.')
        inGame = false
      }
    })
  }
})
