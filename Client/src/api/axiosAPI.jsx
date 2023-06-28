import axios from 'axios';
export default async function API(url,formData,flag){
    console.log(formData);
    try{
        const response = flag ? await axios.post("https://super-mart-backend.vercel.app" + url,formData) : await axios.get("https://super-mart-backend.vercel.app" + url);
        const data = response?.data;
        return data;
    }
    catch (err ) {
        console.log(err);
        return err;
    }
}