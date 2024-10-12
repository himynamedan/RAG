import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
<header class="transparent-header">
<div class="container">
    <div class="logo">
        <h1>RAG</h1>
    </div>
    <nav class="nav-links">
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    </nav>
</div>
</header>
  );
};

export default Navbar;
