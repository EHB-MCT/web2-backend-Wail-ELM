const express = require('express')
const app = express()
const cors = require('cors')
const {
    MongoClient
} = require('mongodb')

const {
    v4: uuidv4,
    validate: uuidValidate
} = require('uuid');

require('dotenv').config()

const client = new MongoClient(process.env.FINAL_URL)
const port = process.env.port || 5200



let users = [];

app.use(express.urlencoded({
    extended: false
}));


app.use(express.static('public'));
app.use(express.json());
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.status(300).redirect('/info.html');
});

app.get("/testMongo", async (req, res) => {

    try {

        // connect to the database

        await client.connect();

        // retrieving users collection data

        const colli = client.db('Login-system').collection('users')
        const users = await colli.find({}).toArray();


        // send back the data with response

        res.status(200).send(users);

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: "something is wrong here!",
            value: error
        })
    } finally {
        await client.close();
    }
})

app.post("/register", async (req, res) => {

    console.log(req.body)

    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(401).send({
            status: "bad request",
            message: "some fields are missing"
        })
        return
    }



    try {

        // connect to the database

        await client.connect();

        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            uuid: uuidv4()

        }

        // retrieving users collection data

        const colli = client.db('Login-system').collection('users')
        const insertedUser = await colli.insertOne(user)


        // send back response when user is saved

        res.status(201).send({
            status: "saved",
            message: "user is saved ",
            data: insertedUser
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: "something is wrong here!",
            value: error
        })
    } finally {
        await client.close();
    }



    console.log(users)


})

app.post("/login", async (req, res) => {


    if (!req.body.email || !req.body.password) {
        res.status(401).send({
            status: "bad request",
            message: "some fields are missing: email and password"
        })
        return
    }


    try {

        // connect to the database

        await client.connect();

        const loginUser = {

            email: req.body.email,
            password: req.body.password,

        }

        // retrieving users collection data

        const colli = client.db('Login-system').collection('users')
        const query = {
            email: loginUser.email
        }
        const user = await colli.findOne(query)

        if (user) {

            // compare password

            if (user.password == loginUser.password) {

                // if password is correct
                res.status(200).send({
                    status: "succeful authentification",
                    message: "you are succesfully logged",
                    data: {
                        username: user.username,
                        email: user.email,
                        uuid: user.uuid
                    }
                })
            } else {
                res.status(401).send({
                    status: "error 2 - password",
                    message: "password is incorrect"
                });
            }

        } else {
            res.status(401).send({
                status: "error 2",
                message: "no user, email not valid"
            });
        }

        // send back response when user is saved

        // res.status(201).send({
        //     status: "saved",
        //     message: "user is saved ",
        //     data : insertedUser
        // });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: "something is wrong here!",
            value: error
        })
    } finally {
        await client.close();
    }



    // let user = users.find(element => element.email == req.body.email)



})

app.post("/verifyID", async (req, res) => {


    // check for faulty and empty fields

    if (!req.body.uuid) {
        res.status(401).send({
            status: "bad request",
            message: "ID is missing"
        })
        return
    } else {
        if (!uuidValidate(req.body.uuid)) {
            res.status(401).send({
                status: "bad request",
                message: "ID is not a valid uuID"
            })
            return
        }



    }


    try {

        // connect to the database

        await client.connect();

        // retrieving users collection data

        const colli = client.db('Login-system').collection('users')
        const query = {
            uuid: req.body.uuid
        }
        const user = await colli.findOne(query)

        if (user) {


            res.status(200).send({
                status: "Verified",
                message: "youre uuid is verified and valid",
                data: {
                    username: user.username,
                    email: user.email,
                    uuid: user.uuid
                }
            })
        } else {
            res.status(401).send({
                status: "verify error",
                message: `No user exists with the following uuID : ${req.body.uuid}`
            });
        }



        // send back response when user is saved

        // res.status(201).send({
        //     status: "saved",
        //     message: "user is saved ",
        //     data : insertedUser
        // });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: "something is wrong here!",
            value: error
        })
    } finally {
        await client.close();
    }



    // let user = users.find(element => element.email == req.body.email)



})


// app.use((_req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', '*');

//     next();
// })

process.on('uncaughtException', function (err) {
    console.log(err);
});


let challenges = []


app.get("/Mongo_challenge", async (req, res) => {

    try {

        // connect to the database

        await client.connect();

        // retrieving users collection data

        const colli = client.db('course-project').collection('create-new-challenges')
        const challenges = await colli.find({}).toArray();


        // send back the data with response

        res.status(200).send(challenges);

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: "something is wrong here!",
            value: error
        })
    } finally {
        await client.close();
    }
})










// app.post('/create_challenges', async (req, res) => {

//     try {

//         const newChallenge = {
//             title: req.body.title,
//             description: req.body.description,
//             dataset: req.body.dataset,
//             result: req.body.result
//         }

//         const colli = client.db('course-project').collection('create-new-challenges)')
//         const insertedChallenge = await colli.insertOne(newChallenge)

//         res.status(201).send({
//             status: "saved",
//             message: "user is saved ",
//             data: insertedChallenge
//         });

//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             error: "something is wrong here!",
//             value: error
//         })
//     } finally {
//         await client.close();
//     }
// })



app.listen(port)