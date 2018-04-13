import React, { Children, Component } from 'react';

import { PropTypes } from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import invariant from 'invariant';
import omit from 'lodash.omit';

export default class ContainerDimensions extends Component {

    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
        onResize: PropTypes.func
    };

    static defaultProps = {
        onResize: () => {}
    }

    static getDomNodeDimensions(node) {
        const { top, right, bottom, left, width, height } = node.getBoundingClientRect();
        return { top, right, bottom, left, width, height };
    }

    constructor() {
        super();

        this.state = {
            initiated: false
        };
    }

    componentWillUnmount() {
        if (this.resizeObserver){
            this.resizeObserver.disconnect();
        }
    }

    setupResizer() {
        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(this.parentNode);
        this.update();
    }

    update () {
        const clientRect = ContainerDimensions.getDomNodeDimensions(this.parentNode);

        this.setState({
            ...clientRect
        });
    }

    handleResize = () => {
        this.update();
        this.props.onResize();
    }

    renderChildren() {
        invariant(this.props.children, 'Expected children to be one of function or React.Element');

        const childrenProps = omit(this.state, ["initiated"]);

        if (typeof this.props.children === 'function') {
            const renderedChildren = this.props.children(childrenProps);
            return renderedChildren && Children.only(renderedChildren);
        }
        return Children.only(React.cloneElement(this.props.children, childrenProps));
    }

    render() {
        return (
            <div ref={(parent) => {
                if (parent && !this.state.initiated) {
                    this.parentNode = parent;
                    this.setState({
                        initiated: true
                    });
                    this.setupResizer();
                }
            }}>
                {this.renderChildren()}
            </div>
        );
    }
}
