import indigo from 'material-ui/colors/indigo';
import orange from 'material-ui/colors/orange';

export default {
    palette: {
        primary: {
            light: indigo[300],
            main: indigo[500],
            dark: indigo[700],
            contrastText: '#fff'
        },
        secondary: {
            light: orange[300],
            main: orange['A200'],
            dark: orange[700],
            contrastText: '#fff'
        }
    },
    status: {
        danger: 'orange',
    },
    typography: {
        button: {
            fontWeight: 400,
            textAlign: 'capitalize'
        },
    },
};
