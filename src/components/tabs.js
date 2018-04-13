import Link from 'gatsby-link';
import React from 'react';
import css from './tabs.module.css';
import cx from 'classnames';

class Parent extends React.Component {
    render () {
        return (
            <div className={css.Parent}>{this.props.children}</div>
        );
    }
}

class Child extends React.Component {
    render () {
        const {linkTo, children, selected} = this.props;
        return (
            <Link
                className={cx(css.Child, {
                    [css.selected]: selected
                })}
                to={linkTo}
            >{children}</Link>
        );
    }
}

export { Parent, Child };
