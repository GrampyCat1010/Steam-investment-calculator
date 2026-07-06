import { Button } from '@mui/material';
import { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function SteamInput({ onSave }) {
    const [steamId, setSteamId] = useState("");
    const handleSave = () => {
        onSave(steamId);
};
    return(
        <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        }}
        >
            <TextField
                fullWidth
                label="steamid"
                value={steamId}
                onChange={(e) => setSteamId(e.target.value)}
            />
            <Button
                onClick={handleSave}
                variant="contained"
                sx={{ mb: 2 }}
            >
                Save
            </Button>
        </Box>
    );
}

export default SteamInput;