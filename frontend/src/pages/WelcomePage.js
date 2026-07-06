import Box from '@mui/material/Box';
import SteamInput from '../components/SteamInput';

function WelcomePage({onSaveSteamId}) {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center', // Центрируем по вертикали
            minHeight: '100vh', // Высота равна высоте всего экрана
            justifyContent: 'center', // Центрируем по горизонтали
        }}>
            <SteamInput onSave={onSaveSteamId} />
        </Box>
    );
}

export default WelcomePage;