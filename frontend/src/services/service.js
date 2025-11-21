// src/services/service.js

import axios from "axios";
const url = "http://localhost:3001"; // correct URL
const validateTokenURL = import.meta.env.VITE_VALIDATE_TOKEN_URL;
const userChaturl = import.meta.env.VITE_USER_CHATS;
const userQuize = import.meta.env.VITE_USER_QUIZE;

const getAll = () => {
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      return { error: error.response?.data || error.message };
    });
};
const getAllchats = (userId) => {
  return axios
    .get(`${userChaturl}/${userId}`)
    .then((response) => response.data)
    .catch((error) => {
      // return error info so component can handle
      return { error: error.response?.data || error?.message };
    });
};

const create = async (userDefineUrl, userData) => {
  try {
    const response = await axios.post(userDefineUrl, userData);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error?.message };
  }
};

const validateToken = (token) => {
  return axios
    .get(validateTokenURL, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log(response.data.fullName, "this is fullname from services");
      console.log(response.data.id, "this is id from services");

      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const quizeGet = async (userId) => {
  try {
    const response = await axios.get(`${userQuize}/${userId}`);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error?.message };
  }
};

const saveQuizAttempt = async (userId, questions, score) => {
  try {
    const response = await axios.post('http://localhost:3001/api/quiz', {
      userId,
      questions, 
      score
    });
    return response.data;
  } catch (error) {
    console.error('Error saving quiz:', error); 
    return { error: error.response?.data?.message || error?.message };
  }
};
const getQuizStats = async (userId)=>{
  try{
    const stats = await axios.get(`http://localhost:3001/api/quiz/${userId}`);
    return stats;
  }catch(error){
    console.error('Error saving quiz:', error); 
    return { error: error.response?.data?.message || error?.message };
  }

}
export default { getAll, getAllchats, create, validateToken, quizeGet, saveQuizAttempt, getQuizStats };
