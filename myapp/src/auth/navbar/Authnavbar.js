import React from "react";
import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Navigation from "../../navigation";

const AuthNavbar = () => {
    return (
        <React.Fragment>
            <Navbar bg="dark" expand="lg" className="navbar-dark">
                <Container>
                    <Navbar.Brand>React Auth Demo</Navbar.Brand>

                    <Navigation/>
                </Container>
                
            </Navbar>
        </React.Fragment>
    );
}
export default AuthNavbar;