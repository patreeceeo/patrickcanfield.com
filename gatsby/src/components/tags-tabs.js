import React from 'react';
import * as Tabs from './tabs';

const TagsTabs = ({selected}) => {
    return (
        <Tabs.Parent>
            <Tabs.Child
                linkTo="/" selected={selected === "all"}>all</Tabs.Child>
            <Tabs.Child
                linkTo="/tags/writing" selected={selected === "writing"}>writing</Tabs.Child>
            <Tabs.Child
                linkTo="/tags/visual" selected={selected === "visual"}>visual</Tabs.Child>
        </Tabs.Parent>
    );
};

export default TagsTabs;
