const customQuery = require('../services/customQuery');
async function verifyEmail(token){
    let user = await customQuery(`SELECT * FROM users WHERE mailToken = '${token}'`);
    if(user?.length == 1){
        try{
            await customQuery(`UPDATE users SET isVerified = true WHERE mailToken = '${token}'`);
            return true;
        }
        catch(err){
            console.log(err.message);
            return false;
        }
    }
    // return false;
}
module.exports = verifyEmail;