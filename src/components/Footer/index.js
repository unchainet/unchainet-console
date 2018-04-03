import React from "react";
import { withStyles } from "material-ui/styles";

const styles = theme => ({
  copyright: { color: theme.typography.caption.color }
});

const Footer = withStyles(styles)(({ classes }) => {
  return (
    <footer className="app-footer">
      <div className="d-flex flex-row justify-content-between">
        <div>
          <span className={classes.copyright}>
            Copyright Unchainet Pty Ltd &copy; 2018
          </span>
        </div>
        <div />
      </div>
    </footer>
  );
});

export default Footer;
