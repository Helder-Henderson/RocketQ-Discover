const Database = require('../db/config')

module.exports = {
    async index(req, res){

        const db = await Database() //iniciando objeto
        const roomId = req.params.room //pegando parametro de roomId
        const questionId = req.params.question //pegando parametro de questionId
        const action = req.params.action //pegando slug, se foi check ou delete
        const password = req.body.password //pegando password do form no modal

        /* Verificar se a senha está correta */
        const verifyRoom = await db.get(`SELECT * FROM rooms WHERE id = ${roomId}`)
        if(verifyRoom.pass == password){
            if(action == "delete"){

                await db.run(`DELETE FROM questions WHERE id = ${questionId}`)

            }else if(action == "check"){

                await db.run(`UPDATE questions SET read = 1 WHERE id = ${questionId}`)

            }
            res.redirect(`/room/${roomId}`)
        } else{
            res.render('passincorrect', {roomId: roomId})
        }


    },

    async create(req, res){
        const db = await Database()
        const question = req.body.question
        const roomId = req.params.room

        //acrescentando questões no banco de dados
        await db.run(`INSERT INTO questions(
            title,
            room,
            read
        )VALUES(
            "${question}",
            ${roomId},
            0
        )`)

        res.redirect(`/room/${roomId}`) //redirecionamento para a url..

    }
}