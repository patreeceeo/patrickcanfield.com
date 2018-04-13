import React from 'react';

class RedirectToResume extends React.Component {
    componentDidMount () {
        location.pathname = '/Resume-Patrick-Canfield.pdf';
    }

    render () {
        return <div>Redirecting... If nothing happens, click <a href="/Resume-Patrick-Canfield.pdf">here</a></div>;
    }
}

export default RedirectToResume;
