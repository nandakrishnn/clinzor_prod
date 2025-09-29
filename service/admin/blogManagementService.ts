
import { axiosPrivate } from "../../axios/axios";
interface BlogPost {
  title: string;
  sub_heading?: string;
  content: string;
  image: string;
  tags?: string; 
}

// Blog Api 
export const createBlog = async (body: BlogPost) => {
  try {
    const response = await axiosPrivate.post(
      `user/blog-list-create/`, // Changed from PUT to POST for creation
      body
    );
    return response.data;
  } catch (error) {
    console.error("FAQ creation error:", error);
    throw error;
  }
};

export const editBlog = async (
  id: string,
  body: BlogPost) => {
  try {
    const response = await axiosPrivate.put(
      `user/blog-rud/${id}/`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("User update error:", error);
    throw error;
  }
};

export const deleteBlog = async (Id: string) => {
  return await axiosPrivate.delete(`user/blog-rud/${Id}/`);
};
export const GetABlog = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/faq-rud/${Id}`);
};

export const GetAllBlog = async (params: any = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosPrivate.get(
      `user/blog-list-create/?${queryString}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
