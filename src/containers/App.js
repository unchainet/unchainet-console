import React, {Component} from 'react';
import {createMuiTheme, MuiThemeProvider} from 'material-ui/styles';
import {Redirect, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {IntlProvider} from 'react-intl'
import 'react-big-calendar/lib/less/styles.less';
import 'styles/bootstrap.scss'
import 'styles/app.scss';
import indigoTheme from './themes/indigoTheme';
import cyanTheme from './themes/cyanTheme';
import orangeTheme from './themes/orangeTheme';
import amberTheme from './themes/amberTheme';
import pinkTheme from './themes/pinkTheme';
import blueTheme from './themes/blueTheme';
import purpleTheme from './themes/purpleTheme';
import greenTheme from './themes/greenTheme';
import darkTheme from './themes/darkTheme';
import AppLocale from '../languageProvider';
import {
  AMBER,
  BLUE,
  CYAN,
  DARK_AMBER,
  DARK_BLUE,
  DARK_CYAN,
  DARK_DEEP_ORANGE,
  DARK_DEEP_PURPLE,
  DARK_GREEN,
  DARK_INDIGO,
  DARK_PINK,
  DEEP_ORANGE,
  DEEP_PURPLE,
  GREEN,
  INDIGO,
  PINK
} from 'constants/ThemeColors';

import MainApp from 'app/index';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Activate from './Activate';

import JssProvider from 'react-jss/lib/JssProvider';
import jss from 'jss';
import preset from 'jss-preset-default';
import {createGenerateClassName} from 'material-ui/styles';
import jssExtend from 'jss-extend';

const generateClassName = createGenerateClassName();
//const jss = create(jssPreset());
jss.setup(preset());
jss.use(jssExtend());
jss.options.insertionPoint = 'jss-insertion-point';

const RestrictedRoute = ({component: Component, ...rest, authUser}) =>
  <Route
    {...rest}
    render={props =>
      authUser
        ? <Component {...props} />
        : <Redirect
          to={{
            pathname: '/signin',
            state: {from: props.location}
          }}
        />}
  />;

class App extends Component {


  getColorTheme(themeColor, applyTheme) {
    switch (themeColor) {
      case INDIGO: {
        applyTheme = createMuiTheme(indigoTheme);
        break;
      }
      case CYAN: {
        applyTheme = createMuiTheme(cyanTheme);
        break;
      }
      case AMBER: {
        applyTheme = createMuiTheme(amberTheme);
        break;
      }
      case DEEP_ORANGE: {
        applyTheme = createMuiTheme(orangeTheme);
        break;
      }
      case PINK: {
        applyTheme = createMuiTheme(pinkTheme);
        break;
      }
      case BLUE: {
        applyTheme = createMuiTheme(blueTheme);
        break;
      }
      case DEEP_PURPLE: {
        applyTheme = createMuiTheme(purpleTheme);
        break;
      }
      case GREEN: {
        applyTheme = createMuiTheme(greenTheme);
        break;
      }
      case DARK_INDIGO: {
        applyTheme = createMuiTheme(indigoTheme);
        break;
      }
      case DARK_CYAN: {
        applyTheme = createMuiTheme(cyanTheme);
        break;
      }
      case DARK_AMBER: {
        applyTheme = createMuiTheme(amberTheme);
        break;
      }
      case DARK_DEEP_ORANGE: {
        applyTheme = createMuiTheme(orangeTheme);
        break;
      }
      case DARK_PINK: {
        applyTheme = createMuiTheme(pinkTheme);
        break;
      }
      case DARK_BLUE: {
        applyTheme = createMuiTheme(blueTheme);
        break;
      }
      case DARK_DEEP_PURPLE: {
        applyTheme = createMuiTheme(purpleTheme);
        break;
      }
      case DARK_GREEN: {
        applyTheme = createMuiTheme(greenTheme);
        break;
      }
    }
    return applyTheme;
  }

  render() {
    const {match, location, themeColor, isDarkTheme, locale, authUser, user} = this.props;
    let applyTheme = createMuiTheme(indigoTheme);
    if (isDarkTheme) {
      applyTheme = createMuiTheme(darkTheme)
    } else {
      applyTheme = this.getColorTheme(themeColor, applyTheme);
    }

    if (location.pathname === '/') {
      if (authUser === null) {
        return (<Redirect to={'/signin'}/>);
      } else {
        return (<Redirect to={'/app/dashboard'}/>);
      }
    }

    const currentAppLocale = AppLocale[locale.locale];
    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider theme={applyTheme}>
          <IntlProvider
            locale={currentAppLocale.locale}
            messages={currentAppLocale.messages}
          >
            <div className="app-main">
              <RestrictedRoute path={`${match.url}app`}
                               authUser={authUser} user={user} component={MainApp}/>
              <Route path='/signin' component={SignIn}/>
              <Route path='/signup' component={SignUp}/>
              <Route path='/activate' component={Activate}/>
            </div>
          </IntlProvider>
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}

const mapStateToProps = ({settings, auth, user}) => {
  const {themeColor, sideNavColor, darkTheme, locale} = settings;
  const {authUser} = auth;
  return {themeColor, sideNavColor, isDarkTheme: darkTheme, locale, authUser, user}
};

export default connect(mapStateToProps)(App);
