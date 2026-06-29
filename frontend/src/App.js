import { Button, Snackbar } from '@mui/material';
import { useState } from "react"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


function App() {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const handleClick = async () => {
        try {
        const response = await fetch("http://127.0.0.1:5000/api/helloworld");
        const data = await response.json();
        console.log(data);
        setMessage(data.message)
        setOpen(true);
    } catch(error) {
        console.error(error);
        setMessage("Connection Error");
        setOpen(true);
        }
    };

    return (
        <div>
          <Button
           onClick={handleClick}
           variant="contained"
           >Hello From React!!!</Button>
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={() =>setOpen(false)}
            message={message}
          />
          <Box sx={{ width: 500, maxWidth: '100%' }}>
            <TextField fullWidth label="fullWidth" id="fullWidth" />
            </Box>
        </div>
  );
}

export default App;