export default (theme) => ({
  root: {
    width: '100%',
    margin: '1em',
  },
  formControl: {
    margin: {
      bottom: theme.spacing.unit * 2.5,
      top: theme.spacing.unit * 2
    },
    display: 'block'
  },
  formInput: {
    minWidth: '230px'
  },
  formInputText: {
    minWidth: '230px'
  },
  form: {
    padding: '20px 20px 10px 20px'
  },
  infoBox: {
    backgroundColor: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '2px',
    width: 'auto',
    minWidth: '150px',
    padding: '25px 0 0 15px'
  },
  section: {
    margin: '-38px -44px 27px',
    padding: '1.6em 2.5em .7em',
    backgroundColor: '#555',
    position: 'relative',
    color: '#fff',
    '& h2': {
      fontSize: '1.5em',
      marginBottom: '4px'
    },
    '& h4': {
      fontSize: '0.8em',
      fontWeight: '200'
    },
    '& h3': {
      fontSize: '22px',
      position: 'absolute',
      right: '30px',
      top: '50%',
      transform: 'translateY(-50%)',
      marginBottom: 0,
      color: theme.palette.secondary.light,
    }
  },
  resources: {
    '& div': {
      lineHeight: '3.5em',
      borderTop: '1px solid #ccc',
      '&:first-child': {
        borderTop: 'none'
      },
      '& h6': {
        display: 'inline-block',
      },
      '& span': {
        float: 'right',
        textAlign: 'right',
        display: 'inline-block',
        paddingRight: 5
      }
    }
  },
  btnBox: {
    backgroundColor: '#eee',
    margin: '25px -44px -28px',
    padding: '12px 12px 2px',
    textAlign: 'right',
    '& button': {
      marginLeft: 10,
      marginBottom: 10
    },
  },
  btnBack: {
    float: 'left'
  },
  radioDescription: {
    fontSize: '12px',
    fontStyle: 'Italic'
  },
  radioLabel: {
    paddingLeft: '10px'
  },
  radioWithDesc: {
    padding: '0 0 10px 0'
  },
  resourcesNote: {
    fontSize: '12px',
    paddingTop: '20px'
  }
});
