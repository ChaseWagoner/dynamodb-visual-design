import React from 'react';

export interface EditableProps {
  valueUpdated: (value: string) => void;
}

interface State {
  editing: boolean;
}

export default class EditableCell<P extends EditableProps> extends React.Component<P, State> {
  private editInputRef: React.RefObject<HTMLInputElement>;

  private get editInput() {
    return this.editInputRef.current as HTMLInputElement;
  }

  constructor(props: P) {
    super(props);
    this.state = { editing: false };

    this.editInputRef = React.createRef();

    this.startEditing = this.startEditing.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
  }

  private get tdProps() {
    const { children, valueUpdated, ...rest } = this.props;

    return rest;
  }

  startEditing() {
    this.setState({ editing: true });
  }

  stopEditing(e: React.FocusEvent<HTMLInputElement>) {
    this.setState({ editing: false });
  }

  componentDidUpdate() {
    if (this.state.editing) {
      this.editInput.focus();
    } else {
      this.props.valueUpdated(this.editInput.value.trim());
    }
  }

  render() {
    const { children, valueUpdated, ...rest } = this.props;
    return (
      <React.Fragment>
        <td
          {...this.tdProps}
          onClick={this.startEditing}
        >
          <span hidden={this.state.editing}>
            {this.props.children}
          </span>
          <input
            {...rest}
            ref={this.editInputRef}
            defaultValue={this.props.children as string}
            hidden={!this.state.editing}
            onBlur={this.stopEditing}
          />
        </td>
      </React.Fragment>
    );
  }
}
