// 


const express = require('express')
const fs = require('fs')

const app = express()

//this line is required to parse the request body
app.use(express.json())

/* Create - POST method */
app.post('/user/add', (req, res) => {
    //get the existing user data
    const existUsers = getUserData()
    
    //get the new user data from post request
    const userData = req.body

    //check if the userData fields are missing
    if (userData.name == null || userData.email == null || userData.phone == null || userData.password == null) {
        return res.status(401).send({error: true, msg: 'User data missing'})
    }
    
    //check if the username exist already
    const findExist = existUsers.find( user => user.name === userData.name )
    if (findExist) {
        return res.status(409).send({error: true, msg: 'username already exist'})
    }

    //append the user data
    existUsers.push(userData)

    //save the new user data
    saveUserData(existUsers);
    res.send({success: true, msg: 'User data added successfully'})

})

/* Read - GET method */
app.get('/user/list', (req, res) => {
    const users = getUserData()
    res.send(users)
})

/* Update - Patch method */
app.patch('/user/update/:email', (req, res) => {
    //get the username from url
    const email = req.params.email

    //get the update data
    const userData = req.body

    //get the existing user data
    const existUsers = getUserData()

    //check if the username exist or not       
    const findExist = existUsers.find( user => user.email === email )
    if (!findExist) {
        return res.status(409).send({error: true, msg: 'username not exist'})
    }

    //filter the userdata
    const updateUser = existUsers.filter( user => user.email !== email )

    //push the updated data
    updateUser.push(userData)

    //finally save it
    saveUserData(updateUser)

    res.send({success: true, msg: 'User data updated successfully'})
})

/* Delete - Delete method */
app.delete('/user/delete/:email', (req, res) => {
    const email = req.params.email

    //get the existing userdata
    const existUsers = getUserData()

    //filter the userdata to remove it
    const filterUser = existUsers.filter( user => user.email !== email )

    if ( existUsers.length === filterUser.length ) {
        return res.status(409).send({error: true, msg: 'username does not exist'})
    }
	// // login method
	// app.get('/user/login', (req, res) => {
	// 	const email = req.query.email
	// 	const password = req.query.password
	
	// 	//get the existing userdata
	// 	const existUsers = getUserData()
	
	// 	//filter the userdata to remove it
	// 	const filterUser = existUsers.find( user => {user.email === email && user.password === password} )
	
	// 	if ( existUsers.length === filterUser.length ) {
	// 		return res.status(409).send({error: true, msg: 'username does not exist'})
	// 	}

    //save the filtered data
    saveUserData(filterUser)

    res.send({success: true, msg: 'User removed successfully'})
    
})


app.get('/user/login/:email/:password', (req, res) => {
    const email = req.params.email
	const password = req.params.password

    //get the existing userdata
    const existUsers = getUserData()

    //filter the userdata to remove it
    const Loginuser = existUsers.find( user => (user.email === email && user.password === password))

    if (!Loginuser) {
        return res.status(404).send({ msg: 'user not exist'})
    }
	// // login method
	// app.get('/user/login', (req, res) => {
	// 	const email = req.query.email
	// 	const password = req.query.password
	
	// 	//get the existing userdata
	// 	const existUsers = getUserData()
	
	// 	//filter the userdata to remove it
	// 	const filterUser = existUsers.find( user => {user.email === email && user.password === password} )
	
	// 	if ( existUsers.length === filterUser.length ) {
	// 		return res.status(409).send({error: true, msg: 'username does not exist'})
	// 	}

    //save the filtered data
    //saveUserData(filterUser)

    res.send({success: true, msg: 'login Successfull'})
    
})

/* util functions */

//read the user data from json file
const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('users.json', stringifyData)
}

//get the user data from json file
const getUserData = () => {
    const jsonData = fs.readFileSync('users.json')
    return JSON.parse(jsonData)    
}

/* util functions ends */


//configure the server port
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})