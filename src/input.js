import React, {Component} from 'react';

// manages inputValue (controlled and uncontrolled)
// calls a fetch with inputValue
class Input extends Component {
	initialState = {
		inputValue: this.props.value || '',
	};

	state = this.initialState;

	isControlled = () => this.props.value !== undefined;

	handleInputChange = event => {
		this.isControlled()
			? this.props.onChange(event)
			: this.setState({inputValue: event.target.value});
	};

	handleKeyPress = event => {
		if (event.key === 'Enter') {
			if (this.props.onEnter) {
				const value = this.isControlled()
					? this.props.value
					: this.state.inputValue;

				this.props.onEnter({text: value});
			}
		}
	};

	render() {
		const currentValue = this.isControlled()
			? this.props.value
			: this.state.inputValue;

		return (
			<input
				type="text"
				onChange={this.handleInputChange}
				onKeyPress={this.handleKeyPress}
				value={currentValue}
			/>
		);
	}
}

export default Input;
