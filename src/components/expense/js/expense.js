import Axios from "axios";


export const listbills = async () => {
  const response = await Axios.get("http://localhost:9005/listbills");
  let obj = response.data;
  console.log(obj);

};
