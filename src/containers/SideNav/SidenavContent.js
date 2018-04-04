import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import "jquery-slimscroll/jquery.slimscroll.min";
import IntlMessages from "util/IntlMessages";
import cx from "classnames";
import $ from "jquery";
import { compose } from "redux";
import { connect } from "react-redux";

class SidenavContent extends Component {
  componentDidMount() {
    /*
    const { history } = this.props;
    const $nav = $(this.nav);
    const slideDuration = 250;

    $nav.slimscroll({
      height: "100%"
    });

    const pathname = `#${history.location.pathname}`; // get current path

    $("ul.nav-menu > li.menu").click(function() {
      const menuLi = this;
      $("ul.nav-menu > li.menu")
        .not(menuLi)
        .removeClass("open");
      $("ul.nav-menu > li.menu ul")
        .not($("ul", menuLi))
        .slideUp(slideDuration);
      $("> ul", menuLi).slideToggle(slideDuration);
      $(menuLi).toggleClass("open");
    });

    $("ul.sub-menu li").click(function(e) {
      let superSubMenu = $(this).parent();
      if (superSubMenu.parent().hasClass("active")) {
        $("li", superSubMenu)
          .not($(this))
          .removeClass("active");
      } else {
        $("ul.sub-menu li")
          .not($(this))
          .removeClass("active");
      }

      $(this).toggleClass("active");
      e.stopPropagation();
    });

    const activeLi = $('a[href="' + pathname + '"]'); // select current a element
    const activeNav = activeLi.closest("ul"); // select closest ul
    if (activeNav.hasClass("sub-menu")) {
      activeNav.slideDown(slideDuration);
      activeNav.parent().addClass("open");
      activeLi.parent().addClass("active");
    } else {
      activeLi.parent().addClass("open");
    }
    */
  }

  isNavActive = (match, location, e) => {
    console.log(match);
    console.log(e);
    if (!match) return false;
    if (location.pathname.startsWith(match.path)) {
      return true;
    }
    return false;
  };

  render() {
    const pathname = this.props.location.pathname;
    return (
      <ul
        className="nav-menu"
        ref={c => {
          this.nav = c;
        }}
      >
        <li className="menu no-arrow tour-dashboard">
          <NavLinkExt to="/app/dashboard">
            <i className="zmdi zmdi-view-dashboard zmdi-hc-fw" />
            <span className="nav-text">
              <IntlMessages id="sidebar.dashboard" />
            </span>
          </NavLinkExt>
        </li>

        <li className="menu no-arrow">
          <NavLinkExt to="/app/workloads">
            <i className="zmdi zmdi-play zmdi-hc-fw" />
            <span className="nav-text">
              <IntlMessages id="sidebar.workloads" />
            </span>
          </NavLinkExt>
        </li>

        <li className="menu no-arrow">
          <NavLinkExt to="/app/wallet">
            <i className="zmdi zmdi-balance-wallet zmdi-hc-fw" />
            <span className="nav-text">
              <IntlMessages id="sidebar.wallet" />
            </span>
          </NavLinkExt>
        </li>

        <li className="menu no-arrow">
          <NavLinkExt to="/app/billing">
            <i className="zmdi zmdi-card zmdi-hc-fw" />
            <span className="nav-text">
              <IntlMessages id="sidebar.billing" />
            </span>
          </NavLinkExt>
        </li>

        <li className="menu no-arrow">
          <NavLinkExt to="/app/priceHistory">
            <i className="zmdi zmdi-trending-up zmdi-hc-fw" />
            <span className="nav-text">
              <IntlMessages id="sidebar.priceHistory" />
            </span>
          </NavLinkExt>
        </li>
      </ul>
    );
  }
}

export default compose(withRouter, connect())(SidenavContent);

const NavLinkExt = props => (
  <NavLink
    {...props}
    isActive={(match, location) => {
      console.log(
        props.to,
        match,
        location,
        !!location.pathname.startsWith(props.to)
      );
      return !!location.pathname.startsWith(props.to);
    }}
  >
    {props.children}
  </NavLink>
);
