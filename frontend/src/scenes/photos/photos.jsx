import { Box, InputLabel } from '@mui/material'
import React from 'react';
import Topbar from '../global/Topbar';
import Sidebar from '../global/Sidebar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Header from '../../components/Header';
import "../photos/photos.css"
import Dropzone from 'react-dropzone';
import { useState } from 'react';
const Photos = () => {
    // eslint-disable-next-line no-unused-vars
    const [fileNames, setFileNames] = useState([]);
    const [isSidebar, setIsSidebar] = useState(true);
    const handleDrop = acceptedFiles =>
    setFileNames(acceptedFiles.map(file => file.name));
    console.log(fileNames);
  return (
    <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
    <Box m="20px">
      <Header title="ADD PHOTOS" subtitle="Insert a New Image" />
      <Box>

        <InputLabel>Insert Photos</InputLabel><br/><br/>
        
        <Dropzone onDrop={handleDrop} >
            {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: "dropzone" })} >
            <input {...getInputProps()} /><AddCircleIcon fontSize='large'/>
            <p>Drag'n'drop files, or click to select files</p>
          </div>
        )}
      </Dropzone>
      <ul>
        {fileNames.map(file =>(
          <li key={file.name}>
          </li>
        ))}
      </ul>
      </Box>
      <br/>< br/>
      
      <Box>
        <InputLabel>Photos</InputLabel>
      </Box>
    </Box>
    </main></div>
  )
}

export default Photos
