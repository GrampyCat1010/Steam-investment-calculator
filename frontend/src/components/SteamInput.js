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
                sx={{
                    '& .MuiOutlinedInput-root': {
                        color: 'white', // Цвет введённого текста
                        fontWeight: 'bold', // Жирный текст в поле
                        '& fieldset': {
                            borderColor: 'white', // Цвет рамки в обычном состоянии
                            borderWidth: '2px', // Толщина рамки
                        },
                        '&:hover fieldset': {
                            borderColor: 'white', // Цвет рамки при наведении
                            borderWidth: '2px',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white', // Цвет рамки в фокусе
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'white', // Цвет лейбла "steamid"
                        fontWeight: 'bold', // Жирный лейбл
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: 'white', // Цвет лейбла в фокусе
                        fontWeight: 'bold',
                    },
                }}
            />
            <Button
                onClick={handleSave}
                variant="contained"
                sx={{
                    mb: 2,
                    backgroundColor: 'white', // Заливка кнопки белым
                    color: 'black', // Цвет текста внутри кнопки
                    fontWeight: 'bold', // Жирный текст кнопки
                    '&:hover': {
                        backgroundColor: '#f0f0f0', // Заливка при наведении
                    },
                }}
            >
                Save
            </Button>
        </Box>
    );
}

export default SteamInput;