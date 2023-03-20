import express, { json } from 'express';
import { createTransport } from "nodemailer";

const app = express();

app.use(express.json())

async function main() {

    let transporter = createTransport({
        service: process.env.SERVICE,
        port: 587,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    })

    app.post('/contact', async function(req,res) {
        
        
        if (req.body.from === undefined || req.body.message === undefined ){
            return res.status(400).json({error: "Field cannot be empty"})
        } else {
            let info = await transporter.sendMail({
                from: req.body.from,
                to: process.env.USER,
                subject: req.body.subject,
                html: `<p> ${req.body.from} \n ${req.body.message} </p>`
            })
    
            return res.status(200).json({"message": info.response})
        }
        
    })

    app.post('/reservation', async function(req, res) {
        let info = await transporter.sendMail({
            from: req.body.from,
            to: "uppist.tech@gmail.com",
            subject: " [Table Reservations] ",
            html: `<h3> ${req.body.date} \n ${req.body.time} \n
                ${req.body.name}\n ${req.body.email} \n ${req.body.phone} \n
                ${req.body.NOG}\n ${req.body.message}</h3>`
        })
    })
}

main().catch((err) => console.log(`An error occured ${err}`))

const PORT = process.env.PORT || 3002

app.listen(PORT, function server(){
    console.log(`Server listening for connections on port ${PORT}`)
})