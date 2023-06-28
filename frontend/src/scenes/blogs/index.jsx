import { Box, Button, InputLabel  } from "@mui/material";
import Header from "../../components/Header";
import JoditEditor from 'jodit-react';
import * as yup from "yup";
import "../blogs/blog.css"
import { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar";
import {  useNavigate } from "react-router-dom";
const Editor = () => {
  const history = useNavigate();
  const editor = useRef(null);
  const [isSidebar, setIsSidebar] = useState(true);
	const [content, setContent] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Authorization': `Bearer ${localStorage.getItem('jwtoken')}`,
          'Content-Type': 'application/json'
        };
        const response = await fetch('/protected', { headers });

        if (!response.ok) {
          history('/'); // Redirect to the login page if the user is not authenticated
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleFormSubmit = (value) => {
    console.log(value);
  };
  const checkoutSchema = yup.object().shape({
    title: yup.string().required("required"),
    cat: yup.string().required("required")
  })

  return (
    <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
    
<Box m="20px">
      <Header title="POST BLOG" subtitle="Post a new Blog" />
      <Formik
        onSubmit={handleFormSubmit}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
            >
              <InputLabel><b>Title</b></InputLabel>
        <input name="title" class="title"/>
        <br/><br/>
        <InputLabel><b>Category</b></InputLabel>
        <select name="cat" className="title">
          <option>--------------------------------------------------------------------------------------------&nbsp;&nbsp;&nbsp;<b>Select Option</b>&nbsp;&nbsp;&nbsp;--------------------------------------------------------------------------------------------</option>
          <option value={"Food & Nutrition"}>Food & Nutrition</option>
          <option value={"Exercise"}>Exercise</option>
        </select>
        <br/><br/>
        <InputLabel><b>Content</b></InputLabel>
        <JoditEditor
        className="JoditEditor"
			  ref={editor}
			  value={content}
			  tabIndex={0} // tabIndex of textarea
			  onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
			  onChange={newContent => {}}
		    />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                ADD NEW TRAINER
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
    </main></div>
  );
};

export default Editor;