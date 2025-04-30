const express=require("express")
const router = express.Router()
const {getAllBlogs, addNewBlog, updateBlog, deleteBlog,getSingleBlog}=require("../../controllers/admin/blogControllers")

router.get("/",getAllBlogs)

