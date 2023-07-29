const getUsers = require('../services/getUser');
const customQuery = require('../services/customQuery');
const { activateChangeRequest, changePassword, createNewUser } = require('../services/manageUsers')
async function verifyUser(session,email,password){
    try{
        users = await getUsers(email,password);
        console.log(users);
        if(users){
            if(users.isverified)
            { 
                session.userID=users.id;
                session.userName=users.username; 
                return 1;
            }else{ 
                return 0;
            }
        }
    }catch(e){
        console.log(e.message);
    }
    return -1;
}
async function addUser(obj){
    return createNewUser(obj);
}

async function forgotPassword(email){
    let user = await customQuery(`SELECT * FROM users WHERE emailid = '${email}'`);
    if(user.length==1){
        return { choice: true, token: user[0].mailToken };
    }
    return { choice: false, token: undefined };
}

let resetToken=undefined;
async function activatePasswordReset(token){
    resetToken = token;
    setTimeout(() =>{
        resetToken=undefined;
    },60000);
    return await activateChangeRequest(token);
};
async function resetAccountPassword(obj){
    let flag =  await changePassword(obj.password,resetToken);
    resetToken = undefined;
    return flag;

}

module.exports = {
    verifyUser,
    addUser,
    forgotPassword,
    activatePasswordReset,
    resetAccountPassword
};