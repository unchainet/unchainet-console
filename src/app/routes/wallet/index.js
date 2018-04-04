import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import CardLayout from "../../../components/CardLayout/index";
import "./wallet.scss";
import Tooltip from "material-ui/Tooltip";
import Typography from "material-ui/Typography";
import { connect } from "react-redux";
import { fetchWallet } from "actions/Wallet";
import Button from "material-ui/Button";
import styles from "./styles";
import { compose } from "redux";
import { withStyles } from "material-ui/styles";
import cx from "classnames";

class Wallet extends React.Component {
  constructor() {
    super();
    this.state = {
      UNET: 144,
      CRC: 0,
      valueUNET: 144,
      valueCRC: 30,
      valueUSD: 48
    };
  }

  calcCRCToUNET = x => {
    return x * 1.6 * 3; //todo replace
  };
  calcUNETtoCRC = x => {
    return x / 4.8; //todo replace
  };

  recalculate = value => {
    switch (value) {
      case 0:
        //all to UNET //if there is CRC convert to UNET
        if (this.state.CRC > 0) {
          this.setState({
            UNET: this.state.UNET + this.state.CRC * 4.8,
            CRC: 0
          });
        }
        break;
      case 50:
        //divide 50/50

        //dummy calc
        this.setState({
          UNET: 72,
          CRC: 15
        });

        break;
      case 100:
        //all to CRC
        if (this.state.UNET > 0) {
          this.setState({
            CRC: this.state.CRC + this.state.UNET / 4.8,
            UNET: 0
          });
        }

        break;
    }
  };

  render() {
    const { UNET, CRC, valueUNET, valueCRC, valueUSD } = this.state;
    const { classes } = this.props;
    return (
      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-3">
          <CardLayout styleName="col-lg-12 jr-card--page">
            <div className="jr-card-header d-flex align-items-center">
              <h3>
                <i className="zmdi zmdi-balance-wallet" />
                Wallet
              </h3>
            </div>

            <div className="wallet-content">
              <div className="row mb-1">
                <div className="col-12" style={{ paddingLeft: "2px" }}>
                  <Tooltip
                    classes={{
                      tooltip: "tooltip-md"
                    }}
                    placement="right"
                    style={{
                      display: "inline-block",
                      position: "relative",
                      left: "-8px"
                    }}
                    id="tooltip-icon"
                    title="UNET price can be volatile so if you prefer to have more predictable spending, &nbsp;compute resource coin(CRC) always represent same value of resources. Use the slider below if you would like to adjust your current ratio."
                  >
                    <i className="zmdi zmdi-info-outline" />
                  </Tooltip>
                  <Typography
                    style={{
                      display: "inline-block",
                      fontSize: "16px",
                      position: "relative",
                      left: "-2px"
                    }}
                  >
                    Current balance
                  </Typography>
                </div>
              </div>

              <div
                className="row mb-3 ml-1 d-flex"
                style={{ maxWidth: "600px" }}
              >
                <div className="item-box item-pd item-bg">
                  <span className="label-currency">
                    UNET:{" "}
                    <span className={classes.unet}>
                      {UNET}
                    </span>
                  </span>
                </div>
                <div className="item-box item-pd item-bg">
                  <span className="label-currency">
                    CRC: <span className={classes.crc}>{CRC}</span>
                  </span>
                </div>
              </div>

              <div className="row d-flex mb-4 ml-1">
                <div className="slider-cont">
                  <Slider
                    step={50}
                    dots={true}
                    defaultValue={0}
                    onAfterChange={this.recalculate}
                  />
                </div>
              </div>

              <div className="row mb-1">
                <div className="col-12" style={{ paddingLeft: "2px" }}>
                  <Tooltip
                    classes={{
                      tooltip: "tooltip-md"
                    }}
                    placement="right"
                    style={{
                      display: "inline-block",
                      position: "relative",
                      left: "-8px"
                    }}
                    id="tooltip-icon"
                    title="Total value of your UNET and CRC tokens in UNET, CRC or USD respectively."
                  >
                    <i className="zmdi zmdi-info-outline" />
                  </Tooltip>
                  <Typography
                    style={{
                      display: "inline-block",
                      fontSize: "16px",
                      position: "relative",
                      left: "-2px"
                    }}
                  >
                    Current balance total value
                  </Typography>
                </div>
              </div>

              <div
                className="row mb-4 ml-1 d-flex"
                style={{ maxWidth: "600px" }}
              >
                <div className="item-box-sm">
                  <span className="label-currency">
                    UNET: <span className={classes.unet}>{valueUNET}</span>
                  </span>
                </div>
                <div className="item-box-sm">
                  <span className="label-currency">
                    CRC: <span className={classes.crc}>{valueCRC}</span>
                  </span>
                </div>
                <div className="item-box-sm">
                  <span className="label-currency">
                    USD: <span className={classes.usd}>{valueUSD}</span>
                  </span>
                </div>
              </div>

              <div className="row mb-1">
                <div className="col-12" style={{ paddingLeft: "2px" }}>
                  <Tooltip
                    classes={{
                      tooltip: "tooltip-md"
                    }}
                    placement="right"
                    style={{
                      display: "inline-block",
                      position: "relative",
                      left: "-8px"
                    }}
                    id="tooltip-icon"
                    title="Deposit UNET tokens to this address to top up your service account."
                  >
                    <i className="zmdi zmdi-info-outline" />
                  </Tooltip>
                  <Typography
                    style={{
                      display: "inline-block",
                      fontSize: "16px",
                      position: "relative",
                      left: "-2px"
                    }}
                  >
                    Deposit address
                  </Typography>
                </div>
              </div>

              <div className="row mb-5 ml-1">
                <div className="item-pd item-bg address-box">
                  0x49DFB10fCE59108f2212EE2DA1bB12ab0AB9a6eD
                </div>
              </div>

              <div className="row">
                <div className="col-12 mb-2">
                  <span className="label">
                    Top up UNET tokens with credit card or paypal
                  </span>
                </div>
              </div>

              <div className="row mb-4 ml-1 d-flex">
                <div className="item-box btn-pd">
                  <Button variant="raised" className="jr-btn bg-white">
                    <i className="zmdi zmdi-card zmdi-hc-fw" />
                    <span>Credit card</span>
                  </Button>
                </div>
                <div className="item-box btn-pd">
                  <Button variant="raised" className="jr-btn bg-white">
                    <i className="zmdi zmdi-paypal zmdi-hc-fw" />
                    <span>Paypal</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardLayout>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ wallet }) => {
  const { info } = wallet;

  return {
    info
  };
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, { fetchWallet })
)(Wallet);
