import React from 'react';
import {connect} from 'react-redux'
import {compose} from 'redux'
import TextField from 'material-ui/TextField';
import './billing.scss';
import CardLayout from '../../../components/CardLayout/index';
import CardBox from '../../../components/CardBox/index';
import {IconButton} from 'material-ui';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import ExpansionPanel, {ExpansionPanelDetails, ExpansionPanelSummary,} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';
import {fetchBilling} from '../../../actions/Billing';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(13),
    flexBasis: '15%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(13),
    flexBasis: '15%',
    flexShrink: 0,
    color: theme.palette.text.secondary,
  },
});

const currencies = [
  {
    value: 'UNET',
    label: 'UNET',
  },
  {
    value: 'USD',
    label: 'USD',
  },
  {
    value: 'CRC',
    label: 'CRC',
  },
];

class Billing extends React.Component {

  handleChange = name => event => {
    this.setState({
        [name]: event.target.value,
    });
  };

  clickSummary = event => {
    event.stopPropagation();
  };

  constructor() {
    super();
    this.state = {
      currency: 'UNET',
    }
  }

  componentWillMount() {
    this.props.fetchBilling();
  }

  render() {
    const {classes, billingList} = this.props;
    const {currency, expanded} = this.state;
    return (
      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-3">

          <CardLayout styleName="col-lg-12">

            <div className="jr-card-header mb-3 d-flex align-items-center">
                <div className="mr-auto">
                    <h3 className="card-heading mb-0">
                        <i className="zmdi zmdi-eye mr-2"/>
                        Billing
                    </h3>
                </div>
                <IconButton className="size-30" onClick={()=>{}}>
                    <i className="zmdi zmdi-more-vert"/>
                </IconButton>
            </div>

            <form className="row" noValidate autoComplete="off">
              <div className="col-md-3 col-12 mb-4">
                <TextField
                  id="select-currency-native"
                  select
                  label="Currency"
                  value={currency}
                  onChange={this.handleChange('currency')}
                  SelectProps={{
                    native: true,
                  }}
                  helperText="Please select your currency"
                  margin="normal"
                  fullWidth
                >
                  {currencies.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </div>
            </form>

            <ResponsiveContainer width="100%" height={200} className="mb-4">
              <BarChart data={billingList}
                        margin={{top: 10, right: 0, left: -15, bottom: 0}}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey={currency} fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>

            <div className={classes.root}>
              <div className="billing-tbl">

                <ExpansionPanel key={'head'}
                                className="billing-panel panel-header"
                                onClick={this.clickSummary}
                                expanded={false}
                >
                  <ExpansionPanelSummary
                                         classes={{
                                           expandIcon: 'expandIcon-left',
                                           expandIconExpanded:'expandIcon-expanded',
                                           root: 'summary-root',
                                           content: 'header-summary-tbl',
                                           expanded: 'summary-expanded',
                                           contentExpanded: 'content-expanded',
                                         }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell className="header-cell" style={{width: '14%'}}>Month</TableCell>
                          <TableCell className="header-cell" style={{width: '14%'}}>Total({currency})</TableCell>
                          <TableCell className="header-cell">Number of instances</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      </TableBody>
                    </Table>
                  </ExpansionPanelSummary>
                </ExpansionPanel>

                {billingList.map((n, i) => {
                          const data = n.data;
                          console.log('n.instances', n.instances)
                          return (

                            <ExpansionPanel key={i.toString()}
                                            className="billing-panel"
                                            classes={{
                                              expanded: 'panel-expanded',
                                            }}
                            >
                              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}
                                                     classes={{
                                                       expandIcon: 'expandIcon-left',
                                                       expandIconExpanded:'expandIcon-expanded',
                                                       root: 'summary-root',
                                                       expanded: 'summary-expanded',
                                                       contentExpanded: 'content-expanded'
                                                     }}
                                                     >
                                <Typography className={classes.heading}>{n.lbl}</Typography>
                                <Typography className={classes.secondaryHeading}>{n[currency]}</Typography>
                                <Typography className={classes.secondaryHeading}>{n.instances}</Typography>
                              </ExpansionPanelSummary>
                              <ExpansionPanelDetails
                              classes={{root: 'panel-details'}}>

                                <div className="row">
                                  <CardBox styleName="col-12" cardStyle="p-0">

                                    <div className="table-responsive-material billing-tbl-month">
                                      <Table>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Provider</TableCell>
                                            <TableCell>Region</TableCell>
                                            <TableCell numeric>CPU cores</TableCell>
                                            <TableCell numeric>Storage (Gb)</TableCell>
                                            <TableCell numeric>GPU cores</TableCell>
                                            <TableCell numeric>Price ({this.state.currency})</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {data.map((n, i) => {
                                            return (
                                              <TableRow key={n.id}>
                                                <TableCell>{n.name}</TableCell>
                                                <TableCell>{n.provider}</TableCell>
                                                <TableCell>{n.region}</TableCell>
                                                <TableCell numeric>{n.cpuCores}</TableCell>
                                                <TableCell numeric>{n.storage}</TableCell>
                                                <TableCell numeric>{n.gpuCores}</TableCell>
                                                <TableCell numeric>{n.price[this.state.currency]}</TableCell>
                                              </TableRow>
                                            );
                                          })}
                                        </TableBody>
                                      </Table>
                                    </div>

                                  </CardBox>
                                </div>


                              </ExpansionPanelDetails>
                            </ExpansionPanel>

                          );
                        })}





              </div>
            </div>

          </CardLayout>

        </div>
      </div>

    );
  }
}


const mapStateToProps = ({billing, settings}) => {
  const {width} = settings;
  const {
    loader,
    alertMessage,
    showMessage,
    noContentFoundMessage,
    billingList,
  } = billing;

  return {
    width,
    loader,
    alertMessage,
    showMessage,
    noContentFoundMessage,
    billingList,
  }
};

export default compose(
  withStyles(styles, {
    name: 'Billing',
  }),
  connect(mapStateToProps, {fetchBilling}),
)(Billing);
