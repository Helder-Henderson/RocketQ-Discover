const Database = require("../db/config")

module.exports = {
    async create(req, res){
        const db = await Database()
        const pass = req.body.password //pegando senha criada no form da EJS.create-pass
        let roomId
        let isRoom = true
        while(isRoom){
            /* Gera o numero da sala com 6 digitos */
            for(var i = 0; i < 6; i++){
                i == 0 ? roomId = Math.floor(Math.random() * 10).toString() :
                roomId += Math.floor(Math.random() * 10).toString()
            }

            /* Verificar se esse numero ja existe */
            const roomsExistIds = await db.all(`SELECT id FROM rooms`)
            isRoom = roomsExistIds.some(roomExistId => roomExistId === roomId)

            if(!isRoom){
                /* Inseri a sala no banco */
                await db.run(`INSERT INTO rooms (
                    id,
                    pass
                ) VAlUES (
                    ${parseInt(roomId)},
                    ${pass}
                )`)
            }
        }         

        await db.close() //fechando banco

        res.redirect(`/room/${roomId}`) //redirecionamento
    },

    async open(req, res){
        const db = await Database()
        const roomId = req.params.room
        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 0`)
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 1`)
        let isNoQuestions

        if(questions.length ==0){
            if(questionsRead.length == 0){
                isNoQuestions = true
            }
        }

        //renderizando para a pag receber os modulos para o EJs gerenciar o carregamento
        res.render("room", {roomId: roomId, questions: questions, questionsRead: questionsRead, isNoQuestions: isNoQuestions})
    },

    enter(req, res){
        const roomId = req.body.roomId

        res.redirect(`/room/${roomId}`)
    }
}