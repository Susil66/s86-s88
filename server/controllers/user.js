const bcrypt = require("bcrypt");
const auth = require("../auth.js"); 
const User = require("../models/User.js"); 
const { errorHandler } = require("../auth.js"); 

module.exports.registerUser = (req, res) => {

       // Checks if the email is in the right format
	console.log(req.body);
	//check if the email has @ symbol
    if (!req.body.email.includes("@")){
        return res.status(400).send({ message: 'Email invalid' });
    }
    // Checks if the mobile number has the correct number of characters
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ message: 'Mobile number invalid'});
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters'});
    // If all needed requirements are achieved
    } else {
        let newUser = new User({
            userName:req.body.username,
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).send({
            message: 'User registered successfully',
            user: result
        }))
        .catch(error => errorHandler(error, req, res));
    }
};

module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")){

        return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                return res.status(404).send({ error: 'No Email Found'});
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.status(200).send({
                       access : auth.createAccessToken(result)
                    });
                } else {
                    //401 - unauthorized
                    return res.status(401).send({ error: 'Email and password do not match'});
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
    }else{
        return res.status(400).send({ error: 'Invalid Email' })
    }
};


