import React from 'react';
import Joyride from 'react-joyride';
import { updateTourStep } from '../../actions/Tour';
import {connect} from 'react-redux';
class Tour extends React.PureComponent {

    static defaultProps = {
        joyride: {
            autoStart: false,
            resizeDebounce: false,
            run: false,
        },
    };

    constructor(props) {
        super(props);

        this.allSteps = [
          [{
              title: 'Welcome to the UNCHAINET Console',
              text: 'Dashboard is the first place you see with all important information. From menu you can modify your ' +
              'workloads, top up your wallet or look at price and billing history.',
              textAlign: 'center',
              selector: '.app-container .app-sidebar .tour-dashboard',
              position: 'right',
              isFixed: true,
            },
            {
              title: 'Workloads',
              text: 'The key element in the console is Workload. It\'s a bucket of resources you buy from provider and ' +
              'the launch configuration you run on it. Every workload shows region, allocated resoures and ip address you can access it on.',
              textAlign: 'center',
              selector: '.app-container .tour-workloads',
              position: 'top',
              isFixed: true,
            },
            {
              title: 'New Workload',
              text: 'Click on a button and we will guide you by creating a new workload.',
              textAlign: 'center',
              selector: '.app-container .tour-new-workload',
              position: 'top',
              isFixed: false,
            }],
          [{
              title: 'Workload name',
              text: 'Enter easy to remember name and click next.',
              textAlign: 'center',
              selector: '.app-container .tour-workload-name',
              position: 'top',
              isFixed: false,
            }],
          [{
              title: 'Workload Region',
              text: 'Select one of the regions where you want to run your workloads. Regions are large geographical ' +
              'locations containing several datacenters.',
              textAlign: 'center',
              selector: '.app-container .tour-workload-region',
              position: 'top',
              isFixed: false,
            }],
          [{
              title: 'Available resources',
              text: 'Every region has limited number of computing resources.',
              textAlign: 'center',
              selector: '.app-container .tour-available-resources',
              position: 'top',
              isFixed: false,
            }],
          [{
              title: 'Quality Score',
              text: 'Quality of providers is measured by their availability, internet speed, hardware type and other metrics.' +
              'The higher the score, the better service, the higher price per resource.',
              textAlign: 'center',
              selector: '.app-container .tour-quality-score',
              position: 'top',
              isFixed: false,
            }, {
              title: 'Same datacenter',
              text: 'You can choose if your workload should be deployed in a single datacenter (for applications requiring ' +
              'to run on the same network) or across multiple datacenters (for more available resources).',
              textAlign: 'center',
              selector: '.app-container .tour-same-network',
              position: 'top',
              isFixed: false,
            }],
          [{
              title: 'Select profile and resources',
              text: 'Select the computing profile for your workload, then choose number of CPUs and required storage. ',
              textAlign: 'center',
              selector: '.app-container .tour-profile-resources',
              position: 'top',
              isFixed: false,
            }, {
              title: 'Price estimate',
              text: 'As you change the amount and profile of required resources, you can see the live preview of expected' +
              ' price in CRC/hour. 1 CRC is approximately $0.01',
              textAlign: 'center',
              selector: '.app-container .tour-price-estimate',
              position: 'top',
              isFixed: false,
            }],
          [{
              title: 'Max bid price',
              text: 'UNCHAINET launches with spot pricing model. You can set maximum price you are willing to pay, and you ' +
              'will pay the price of the second highest bidder. This way it\'s fair and affordable for everyone and UNCHAINET can ' +
              'build a large liquid market of computing power.',
              textAlign: 'center',
              selector: '.app-container .tour-max-bid-price',
              position: 'top',
              isFixed: false,
            }],
          [{
              title: 'Install config',
              text: 'UNCHAINET currently supports Kubernetes configurations and single container deployments. In the near ' +
              'future we will add OpenStack and other interfaces for an effortless migration to the UNCHAINET platform.',
              textAlign: 'center',
              selector: '.app-container .tour-installation-script',
              position: 'top',
              isFixed: false,
            }],
          [{
              title: 'Launch workload',
              text: 'Review and launch the workload.',
              textAlign: 'center',
              selector: '.app-container .tour-workload-launch',
              position: 'top',
              isFixed: false,
            }]
        ];

        this.state = {
            autoStart: false,
            running: false,
            steps: ( props.tour.lastVisitedStep < 0 ) ? this.allSteps[0] : [],
            step: 0,
        };

        this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
        this.handleJoyrideCallback = this.handleJoyrideCallback.bind(this);
    }

    componentWillReceiveProps(nextProps){

      if (nextProps.tour.lastVisitedStep < nextProps.tour.goToStep){
        //without resetting the component in the DOM it behaves randomly (doesn't show for steps 2+)
        this.setState({
          disableTour: true
        });

        setTimeout(() => {
          this.setState({
            autoStart:true,
            running:true,
            disableTour:false,
            steps: this.allSteps[nextProps.tour.goToStep],
            step: 0
          })
        }, 1000);
      }

    }


    handleNextButtonClick() {
        if (this.state.step === 1) {
            this.joyride.next();
        }
    }

    handleJoyrideCallback(result) {
        const {joyride} = this.props;

        if (result.type === 'step:before') {
            // Keep internal state in sync with joyride
            this.setState({step: result.index});
        }

        if (result.type === 'finished' && this.state.running) {
            // Need to set our running state to false, so we can restart if we click start again.
            this.setState({running: false});
            this.props.updateTourStep(this.props.tour.goToStep);

        }

        if (result.type === 'error:target_not_found') {
            this.setState({
                //step: result.action === 'back' ? result.index - 1 : result.index + 1,
                autoStart: result.action !== 'close' && result.action !== 'esc',
            });
        }

        if (typeof joyride.callback === 'function') {
            joyride.callback();
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                running: ( this.props.tour.lastVisitedStep < 0 ),
                step: 0,
            });
        }, 1000);
    }

    render() {
        const {joyride} = this.props;
        const joyrideProps = {
            autoStart: joyride.autoStart || this.state.autoStart,
            callback: this.handleJoyrideCallback,
            debug: false,
            disableOverlay: this.state.step === 1,
            resizeDebounce: joyride.resizeDebounce,
            run: joyride.run || this.state.running,
            scrollToFirstStep: joyride.scrollToFirstStep || true,
            stepIndex: joyride.stepIndex || this.state.step,
            steps: joyride.steps || this.state.steps,
            type: joyride.type || 'continuous'
        };
        if (this.state.disableTour){
          return null;
        }
        return ( <Joyride
                {...joyrideProps}
                ref={c => (this.joyride = c)}/>

        )

    }
}

function stateToProps({tour}) {
  return { tour };
}

const mapDispatchToProps = {
  updateTourStep
};

export default connect(stateToProps, mapDispatchToProps)(Tour);


