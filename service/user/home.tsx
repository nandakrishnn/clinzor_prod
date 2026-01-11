import { axiosPublic } from "@/axios/axios";
import { USER_CLINIC, USER_HOME } from "@/utils/Endpoint";


// GET ALL SERVICE FOR HOME
export const getServices = async () => {
  const res = await axiosPublic.get(USER_HOME.GET_SERVICE);
  return res?.data;
};

// GET ALL OFFERS FOR HOME
export const getAllOffers = async () => {
  const res = await axiosPublic.get(USER_HOME.GET_ALL_OFFERS)
  return res?.data

};


export const getClinicDetail = async(clinicId:string)=>{
  const res = await axiosPublic.get(`${USER_CLINIC.GET_A_CLINIC}${clinicId}`)
  return res?.data
}


// GET ALL BLOG DATA
export const getAllBlogData = async () => {
  const res = await axiosPublic.get(USER_HOME.GET_ALL_BLOGS)
  return res?.data
}

// GET ALL FAQ
export const getFaq = async () => {
  const res = await axiosPublic.get(USER_HOME.GET_ALL_FAQ)
  return res?.data
}