import Dimensions from './dimensions';
import React from 'react';
import * as Tabs from './tabs';

class Filter extends React.Component {

    renderTabs () {
        const { selected } = this.props;

        return (
            <Tabs.Parent>
                <Tabs.Child
                    linkTo="/" selected={selected === "all"}>all</Tabs.Child>
                <Tabs.Child
                    linkTo="/tags/writing" selected={selected === "writing"}>writing</Tabs.Child>
                <Tabs.Child
                    linkTo="/tags/art" selected={selected === "art"}>art</Tabs.Child>
            </Tabs.Parent>
        );
    }

    renderDropdown () {
    }

    renderWithDimensions ({width}) {
    }

    render () {
    }
}

export default Filter;
