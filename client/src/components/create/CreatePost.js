import { useState, useEffect, useContext } from 'react';
import { Box, styled, FormControl, InputBase, Button, TextareaAutosize } from '@mui/material';
import { AddCircle as Add } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataProvider';
import { API } from '../../service/api';

const Container = styled(Box)(({ theme }) => ({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: {
        margin: 0
    },
}));

const Image = styled('img')({
    width: '100%',
    height: '50vh',
    objectFit: 'cover'
});

const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
`;

const InputTextField = styled(InputBase)`
    flex: 1;
    margin: 0px 30px; 
    font-size: 25px;
`;

const Textarea = styled(TextareaAutosize)`
    width: 100%;
    margin-top: 50px;
    font-size: 18px;
    border: none;
    &:focus-visible {
        outline: none;
    }
`;

const initialPost = {
    title: '',
    description: '',
    picture: '',
    username: '',
    categories: '',
    createdDate: new Date()
};

const CreatePost = () => {
    const [post, setPost] = useState(initialPost);
    const [file, setFile] = useState('');
    const { account } = useContext(DataContext);
    const location = useLocation();
    const navigate = useNavigate();

    const url = post.picture ? post.picture : 'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';

    useEffect(() => {
        console.log("Account from DataContext:", account);
    
        const getImage = async () => {
            if (file) {
                const data = new FormData();
                data.append("name", file.name);
                data.append("file", file);
    
                try {
                    const response = await API.uploadFile(data);
                    if (response.data) {
                        setPost(prevPost => ({
                            ...prevPost,
                            picture: response.data
                        }));
                    } else {
                        throw new Error("No data received from the server");
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                }
            }
        };
    
        getImage();
    
        setPost(prevPost => ({
            ...prevPost,
            categories: location.search?.split('=')[1] || 'All',
            username: account.username
        }));
    
        console.log("Post after update:", post);
    }, [file, account, location.search]); // Added post to the dependency array
    
    const handleChange = (e) => {
        setPost({...post, [e.target.name]: e.target.value});
    };

    const savePost = async () => {
        if (!post.username) {
            console.error("Username is required");
            console.log("Post object:", post);  // Add this log
            return;
        }

        try {
            let response = await API.createPost(post);
            if (response.isSuccess) {
                navigate('/');
            } else {
                throw new Error("Failed to create post");
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <Container>
            <Image src={url} alt='banner' />

            <StyledFormControl>
                <label htmlFor='fileInput'>
                    <Add fontSize='large' color='action'/>
                </label>
                <input 
                    type='file' 
                    id='fileInput' 
                    style={{display:'none'}} 
                    onChange={(e) => setFile(e.target.files[0])} 
                />

                <InputTextField 
                    placeholder='Title' 
                    onChange={handleChange} 
                    name="title" 
                    value={post.title}
                />
                <Button variant='contained' onClick={savePost}>Publish</Button>
            </StyledFormControl>

            <Textarea 
                minRows={5}
                placeholder='Tell your story...'
                onChange={handleChange} 
                name="description"
                value={post.description}
            />
        </Container>
    );
};

export default CreatePost;
