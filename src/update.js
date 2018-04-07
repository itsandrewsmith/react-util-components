import React, { Component } from 'react';

class Update extends Component {
    static defaultProps = {
        value: null,
        onUpdate: () => {}
    }

    componentDidMount() {
        this.props.onUpdate(this.props.value);
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.value !== prevProps.value){
            this.props.onUpdate(this.props.value)
        }
    }


    render() { 
        return this.props.children ? this.props.children : null;
    }
}
 
export default Update;