import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from "../../firebase";

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Clear input fields on component mount
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
    }, []);

    const signUp = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('The password must be at least 6 characters long.');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user document in Firestore with additional "role" field
            await setDoc(doc(db, 'users', user.uid), {
                firstName,
                lastName,
                email,
                password,
                role: 'user'
            });

            console.log(userCredential);
            setError(''); // Clear error message on successful signup
            navigate('/login'); // Navigate to login page after successful signup
        } catch (error) {
            console.log(error);
            setError(error.message); // Set the error message on failure
        }
    };

    return (
        <div className='container'>
            <div className='ellipse'></div>
            <div className='ellipse1'></div>
            <div className="flex-center">
                <h2 className='text' style={{ marginTop: '-20px' }}>Create your account</h2>
                {/* Move the error message below the heading */}
                {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>} {/* Added margin top */}
                <form onSubmit={signUp}>
                    <div className="form__group field">
                        <input type="text" className="form__field" placeholder="First Name" name="firstName" id='firstName' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        <label htmlFor="firstName" className="form__label">First Name</label>
                    </div>
                    <div className="form__group field">
                        <input type="text" className="form__field" placeholder="Last Name" name="lastName" id='lastName' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        <label htmlFor="lastName" className="form__label">Last Name</label>
                    </div>
                    <div className="form__group field">
                        <input type="email" className="form__field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" id='email' required />
                        <label htmlFor="email" className="form__label">Email</label>
                    </div>
                    <div className="form__group field">
                        <input type="password" className="form__field" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" id='password' required />
                        <label htmlFor="password" className="form__label">Password</label>
                    </div>
                    <div className='button-center'>
                        <button className='button-19' type="submit">Sign Up</button>
                    </div>
                </form>
                <p className="login-text" style={{ marginBottom: '-30px' }}>
                    Already have an account? 
                    <Link to="/login"> Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
