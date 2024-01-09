import {
  MsgCommand
} from '../structures/msgcommands.js'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} from 'discord.js'
let inGame

export default new MsgCommand({
  name: 'combat',
  description: 'Permet de créer un jeu de combat entre deux teams.',
  userPermssions: 'EVERYONE',
  commandCategory: 'INFORMATIONS',

  /**
   * @param { { commands: Collection, events: Collection, db: QuickDB } & Client } client
   * @param { Message } message
   * @param { String[] } args
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
    if (message.member.roles.cache.find(r => r.id === teamrat)) player1team = 'Rat'
    if (message.member.roles.cache.find(r => r.id === teamcafard)) player1team = 'Cafard'
    if (message.member.roles.cache.find(r => r.id === teamcrapaud)) player1team = 'Crapaud'

    let playerteam
    if (message.member.roles.cache.find(r => r.id === teamrat)) playerteam = 'rats'
    if (message.member.roles.cache.find(r => r.id === teamcafard)) playerteam = 'cafards'
    if (message.member.roles.cache.find(r => r.id === teamcrapaud)) playerteam = 'crapauds'
    const team = await client.db.get(`${playerteam}_${message.guild.id}`)
    const player1 = {
      name: message.author.username,
      id: message.author.id,
      team: player1team,
      health: 200,
      turn: true
    }
    const player2 = {
      name: '',
      id: '',
      health: 200,
      team: '',
      turn: false
    }

    message.channel.send('Veuillez mentionner votre adversaire.')
    const filter = m => m.author.id === message.author.id
    const collector = message.channel.createMessageCollector({
      filter,
      time: 15000,
      max: 1
    })

    collector.on('collect', async m => {
      if (m.mentions.members.first().user.username !== player1.name && m.mentions.members.first()) {
        let player2team
        if (m.mentions.members.first().roles.cache.find(r => r.id === teamrat)) player2team = 'Rat'
        if (m.mentions.members.first().roles.cache.find(r => r.id === teamcafard)) player2team = 'Cafard'
        if (m.mentions.members.first().roles.cache.find(r => r.id === teamcrapaud)) player2team = 'Crapaud'
        player2.team = player2team
        if (player2.team === player1.team) {
          await collector.stop()
          inGame = false
          return await message.channel.send('Vous êtes dans la même team, donc, vous ne pouvez pas vous affronter.')
        }
        player2.id = m.guild.members.cache.get(m.mentions.members.first().id).user.id
        player2.name = m.guild.members.cache.get(m.mentions.members.first().id).user.username
        await message.channel.send('Le combat va bientôt commencer !')
      } else {
        message.channel.send('Le nom du deuxième joueur ne peut pas être le même que le premier joueur.')
        inGame = false
      }
    })

    collector.on('end', async () => {
      if (player2.name === '') {
        await message.channel.send('Aucun deuxième joueur n\'a été trouvé.')
        inGame = false
      } else {
        await message.channel.send(`Le jeu commence entre ${player1.name} et ${player2.name} !\nVous possédez chacun 200 points de vie.\n-------------------------------------------`)
        await runGameLoop(player1, player2, message.channel)
      }
    })

    async function runGameLoop (player1, player2, channel) {
      while (player1.health > 0 && player2.health > 0) {
        const currentPlayer = player1.turn ? player1 : player2
        const otherPlayer = player1.turn ? player2 : player1

        await channel.send(`${currentPlayer.name}, c'est votre tour !\nJoueur 1 : **${player1.health}PV**\nJoueur 2 : **${player2.health}PV**\n-------------------------------------------`)

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('1')
              .setLabel('1. Attaquer')
              .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
              .setCustomId('2')
              .setLabel('2. Se Soigner')
              .setStyle(ButtonStyle.Secondary)
          )

        const m = await channel.send({
          content: 'Que voulez-vous faire ?\n1. Attaquer\n2. Se soigner',
          components: [row]
        })
        const collector2 = await m.createMessageComponentCollector({
          time: 30000,
          componentType: ComponentType.Button
        })

        await new Promise(resolve => {
          collector2.on('collect', async m => {
            const action = m.customId
            if (player2.turn && m.user.id !== player2.id) return
            if (player1.turn && m.user.id !== player1.id) return

            if (action === '1') {
              await m.deferUpdate()
              const damage = Math.floor(Math.random() * 61) + 20
              otherPlayer.health -= damage
              await channel.send(`${currentPlayer.name} a infligé ${damage} points de dégâts à ${otherPlayer.name} !`)
            } else if (action === '2') {
              await m.deferUpdate()
              if (currentPlayer.health <= 20) return await channel.send('Vous ne pouvez pas soigner si vous avez moins de 20 pv.')
              if (currentPlayer.health >= 200) return await channel.send('Vous ne pouvez pas soigner si vous avez plus de 200 pv.')
              const healing = Math.floor(Math.random() * 41) + 30
              currentPlayer.health += healing
              await channel.send(`${currentPlayer.name} s'est soigné de ${healing} points de vie !`)
            } else {
              await channel.send('Action invalide. Veuillez choisir 1 ou 2.')
            }

            if (player1.turn) {
              player1.health = Math.max(player1.health, 0)
            } else {
              player2.health = Math.max(player2.health, 0)
            }
            let gagnant
            if (player1.health <= 0) gagnant = message.guild.members.cache.get(player2.id)
            if (player2.health <= 0) gagnant = message.member
            if (player1.heath <= 0 || player2.health <= 0) {
              try {
                const points = Math.floor(Math.random() * 100) + 1
                message.channel.send(`Le gagnant est ${gagnant} !\nVous gagnez donc **${points}** points pour votre team.`)
                collector.stop()
                const allpointsofmemberget = await client.db2.get(`points_${message.member.user.id}_${message.guild.id}`)
                let allpointsofmember
                if (isNaN(parseInt(allpointsofmemberget))) {
                  allpointsofmember = 0
                } else {
                  allpointsofmember = parseInt(allpointsofmemberget)
                }
                await client.db2.set(`points_${message.member.user.id}_${message.guild.id}`, allpointsofmember + points)
                await client.db.set(`${playerteam}_${message.guild.id}`, {
                  points: parseInt(team.points) + points,
                  leader: [...team.leader, {
                    member: message.member.user.id,
                    points: allpointsofmember + points
                  }],
                  trophees: team?.trophees
                })
                inGame = false
              } catch (error) {
                console.log(error)
                inGame = false
              }
            }
            player1.turn = !player1.turn
            player2.turn = !player2.turn
            resolve()
          })
        })
      }
    }
  }
})
