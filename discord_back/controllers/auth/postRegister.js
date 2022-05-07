const bcrypt = require("bcryptjs/dist/bcrypt");
const User = require("../../models/user")
const jwt = require("jsonwebtoken");

const postRegister = async (req, res) => {
    try{
        const {username, mail, password} = req.body;
        // check if user exist
        const userExist = await User.exists({mail: mail});
         if(userExist){
            return res.status(409).send('E-mail already in use.');
        }

        //encrypt password
        const encryptedpassword = await bcrypt.hash(password, 10);

        //create user and save in the BDD
        const user = await User.create({
            username,
            mail: mail.toLowerCase(),
            password: encryptedpassword
        });

        //create a jwt Token 
        const token = jwt.sign({
            userId: user._id,
            mail
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "24H"
            }
        );




        res.status(201).json({
            userDetails: {
                mail: user.mail,
                token: token,
                username: user.username
            }
        });
    }
    catch(err){
        return res.status(500).send("Error occured. Please try again");
    }

};

 
module.exports =postRegister;