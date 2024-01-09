/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import {
  MsgCommand
} from '../structures/msgcommands.js'
import {
  TicTacToe
} from 'discord-gamecord'
let inGame
export default new MsgCommand({
  name: 'morpion',
  description: 'Permet de voir les membres dans une team.',
  userPermssions: 'EVERYONE',
  commandCategory: 'INFORMATIONS',

  /**
     * @param { { commands: Collection, events: Collection, db: QuickDB} & Client } client
     * @param { CommandInteraction } interaction
     */

  async callback (client, message, args) {
    if (inGame) return message.reply('Une partie est déjà en cours.')
    if (!message.mentions.users.first()) return message.reply('Veuillez mentionner votre adversaire afin de commencer une partie de morpion.')
    if (message.mentions.users.first().id === message.member.user.id) return message.reply('Veuillez mentionner votre adversaire afin de commencer une partie de morpion.')
    inGame = true
    let player1team = {
      team: null,
      id: message.member.id
    }
    let player2team = {
      team: null,
      id: null
    }
    const teambatard = await client.db.get(`roleteamd_${message.guild.id}`)
    if (message.member.roles.cache.find(r => r.id === teambatard)) return message.channel.send('Vous ne pouvez pas jouer car vous êtes un batard.')
    if (message.mentions.members.first().roles.cache.find(r => r.id === teambatard)) return message.channel.send('Votre adversaire ne peut pas jouer car c\'est un batard.')
    const teamrat = await client.db.get(`roleteamb_${message.guild.id}`)
    const teamcafard = await client.db.get(`roleteama_${message.guild.id}`)
    const teamcrapaud = await client.db.get(`roleteamc_${message.guild.id}`)
    if (message.member.roles.cache.find(r => r.id === teamrat)) player1team.team = 'rats'
    if (message.member.roles.cache.find(r => r.id === teamcafard)) player1team.team = 'cafards'
    if (message.member.roles.cache.find(r => r.id === teamcrapaud)) player1team.team = 'crapauds'
    if (message.mentions.members.first().roles.cache.find(r => r.id === teamrat)) player2team.team = 'rats'
    if (message.mentions.members.first().roles.cache.find(r => r.id === teamcafard)) player2team.team = 'cafards'
    if (message.mentions.members.first().roles.cache.find(r => r.id === teamcrapaud)) player2team.team = 'crapauds'
    player2team.id = message.mentions.members.first().user.id
    if (player2team.team === player1team.team) {
      inGame = false
      return await message.channel.send('Vous êtes dans la même team, donc, vous ne pouvez pas vous affronter.')
    }
    const Game = new TicTacToe({
      message,
      isSlashGame: false,
      opponent: message.mentions.users.first(),
      embed: {
        title: 'Morpion',
        color: '#FF0000',
        statusTitle: 'Status',
        overTitle: 'Fin de la partie'
      },
      emojis: {
        xButton: '❌',
        oButton: '🔵',
        blankButton: '➖'
      },
      mentionUser: true,
      timeoutTime: 60000,
      xButtonStyle: 'DANGER',
      oButtonStyle: 'PRIMARY',
      requestMessage: '{player} vous invite à une partie de morpion !',
      rejectMessage: 'L\'adversaire a refusé la partie.',
      turnMessage: '{emoji} | C\'est le tour de **{player}**.',
      winMessage: '{emoji} | **{player}** a gagné la partie de morpion.',
      tieMessage: 'Égalité ! Personne n\'a gagné la partie !',
      timeoutMessage: 'L\'Adversaire n\'a pas répondu à temps, fin de la partie.',
      playerOnlyMessage: 'Seul {player} et {opponent} peuvent utiliser ces boutons.'
    })

    await Game.startGame()
    Game.on('gameOver', async result => {
      inGame = false
      const points = Math.floor(Math.random() * 50) + 1
      message.channel.send(`Le gagnant est <@${result.winner}> !\nVous gagnez donc **${points}** points pour votre team.`)
      const allpointsofmemberget = await client.db2.get(`points_${result.winner}_${message.guild.id}`)
      let allpointsofmember
      if (isNaN(parseInt(allpointsofmemberget))) {
        allpointsofmember = 0
      } else {
        allpointsofmember = parseInt(allpointsofmemberget)
      }
      let playerteam
      if (player1team.id === result.winner) playerteam = player1team.team
      if (player2team.id === result.winner) playerteam = player2team.team
      const team = await client.db.get(`${playerteam}_${message.guild.id}`)
      await client.db2.set(`points_${result.winner}_${message.guild.id}`, allpointsofmember + points)
      await client.db.set(`${playerteam}_${message.guild.id}`, {
        points: parseInt(team.points) + points,
        leader: [...team.leader, {
          member: result.winner,
          points: allpointsofmember + points
        }],
        trophees: team?.trophees
      })
    })
  }
})
