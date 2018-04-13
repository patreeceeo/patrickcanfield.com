import Header from '../components/header';
import React from 'react';
import css from './contact.module.css';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faAddressBook, faCameraRetro, faCode, faQuoteLeft } from '@fortawesome/fontawesome-free-solid';

class Contact extends React.Component {

    render () {
        return (
            <Header>
                <ul className={css.Contact}>
                    <li><a href="https://instagram.com/patreeceeo" target="_blank"><FontAwesomeIcon icon={faCameraRetro}/> instagram</a></li>
                    <li><a href="https://www.facebook.com/pscale01" target="_blank"><FontAwesomeIcon icon={faAddressBook}/> facebook</a></li>
                    <li><a href="https://twitter.com/pzatrick" target="_blank"><FontAwesomeIcon icon={faQuoteLeft}/> twitter</a></li>
                    <li><a href="https://github.com/pzatrick" target="_blank"><FontAwesomeIcon icon={faCode}/> github</a></li>
                </ul>
            </Header>
            );
    }
}

export default Contact;
