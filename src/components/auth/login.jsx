import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from "../../firebase";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Clear input fields on component mount
        setEmail('');
        setPassword('');
    }, []);

    const signIn = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch the user's first name from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const firstName = userData.firstName;
                const role = userData.role;

                if (role === 'user') {
                  navigate('/chat', { state: { firstName: firstName } });
              } else if (role === 'admin') {
                  navigate('/admin');
              } else {
                  setError('Invalid role.');
              }
            } else {
                setError('User data not found.');
            }
        } catch (error) {
            console.error("Error signing in:", error);
            switch (error.code) {
                case 'auth/wrong-password':
                    setError('Invalid password.');
                    break;
                case 'auth/user-not-found':
                    setError('No user found with this email.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/invalid-credential':
                    setError('Invalid credentials. Please check your email and password.');
                    break;
                default:
                    setError('Error signing in. Please try again.');
                    break;
            }
        }
    };

    return (
        <div className='container'>
            <div className='ellipse'></div>
            <div className='ellipse1'></div>
            <div className="flex-center">
                <h2>Login</h2>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <form onSubmit={signIn}>
                    <div className="form__group field">
                        <input
                            type="email"
                            className="form__field"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            id='email'
                            required
                        />
                        <label htmlFor="email" className="form__label">Email</label>
                    </div>
                    <div className="form__group field">
                        <input
                            type="password"
                            className="form__field"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            id='password'
                            required
                        />
                        <label htmlFor="password" className="form__label">Password</label>
                    </div>
                    <div className='button-center'>
                        <button className='button-19' type='submit'>Log In</button>
                    </div>
                </form>
                <p className="signup-text">
                    Don't have an account yet? 
                    <Link to="/signup"> Sign Up Now</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
