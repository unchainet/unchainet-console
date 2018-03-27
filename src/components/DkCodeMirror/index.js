import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import debounce from 'lodash.debounce';

class DkCodeMirror extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.object
  }

  codeMirrorInput = null
  codeMirror = null

  componentDidMount() {
    this.codeMirror = CodeMirror.fromTextArea(this.codeMirrorInput, this.props.options);
    this.codeMirror.on('change', this.codemirrorValueChanged);
    this.codeMirror.setValue(this.props.value || '');
  }

  componentWillReceiveProps = debounce(function (nextProps) {
    if (this.codeMirror && nextProps.value !== undefined && this.codeMirror.getValue() !== nextProps.value) {
      this.codeMirror.setValue(nextProps.value);
    }

    if (typeof nextProps.options === 'object') {
      for (let optionName in nextProps.options) {
        if (nextProps.options.hasOwnProperty(optionName)) {
          this.codeMirror.setOption(optionName, nextProps.options[optionName]);
        }
      }
    }
  }, 0)


  codemirrorValueChanged = (doc, change) => {
    if (this.props.onChange && change.origin != 'setValue') {
      this.props.onChange(doc.getValue());
    }
  }

  render() {
    return (
      <textarea ref={el => this.codeMirrorInput = el}/>
    )
  }
}


export default DkCodeMirror;