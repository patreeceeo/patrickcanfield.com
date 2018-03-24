import Dimensions from './dimensions';
import React from 'react';
import * as Tabs from './tabs';
import { navigateTo } from "gatsby-link";

class Filter extends React.Component {

    handleSelectOption = (e) => {
        navigateTo({
            all: "/",
            writing: "/tags/writing",
            art: "/tags/art"
        }[e.target.value]);
    }

    renderTabs () {
        const { query = { tag: "all" } } = this.props;
        console.log(query);

        return (
            <Tabs.Parent>
                <Tabs.Child
                    linkTo="/" selected={query.tag === "all"}>all</Tabs.Child>
                <Tabs.Child
                    linkTo="/tags/writing" selected={query.tag === "writing"}>writing</Tabs.Child>
                <Tabs.Child
                    linkTo="/tags/art" selected={query.tag === "art"}>art</Tabs.Child>
            </Tabs.Parent>
        );
    }

    renderDropdown () {
        const { query = { tag: "all" } } = this.props;
        return (
            <select onChange={this.handleSelectOption} value={query.tag}>
                <option value="all">all</option>
                <option value="writing">writing</option>
                <option value="art">art</option>
            </select>
        );
    }

    renderWithDimensions = ({width}) => {
        return width < 600
            ? this.renderDropdown()
            : this.renderTabs();
    }

    render () {
        return <Dimensions>{this.renderWithDimensions}</Dimensions>;
    }
}

export default Filter;
