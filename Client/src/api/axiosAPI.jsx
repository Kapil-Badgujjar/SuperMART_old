import {} from 'dotenv/config';
import axios from 'axios';
export default async function API(url,formData,flag){
    console.log(formData);
    try{
        const response = flag ? await axios.post(process.env.REACT_APP_SERVER_ADDRESS + url,formData) : await axios.get("https://super-mart-backend.vercel.app" + url);
        const data = response?.data;
        return data;
    }
    catch (err ) {
        console.log(err);
        return err;
    }
}