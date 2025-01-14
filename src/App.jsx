import { Routes, Route, Navigate } from 'react-router-dom';
import Form from './components/Form/Form.jsx';
import PWABadge from './PWABadge.jsx';
import Dashboard from './components/Home/Dashboard.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { validateUser } from './redux/api/authUserSlice.js';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();
  const { user, status, loggedIn } = useSelector(state => state.authUser);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(validateUser());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (status === "succeeded") {
      console.log(user)
    }
  }, [status, user])

  return (
    <div>
      <Routes>
        <Route path='/login' element={loggedIn ? <Navigate to='/administrativeworld/home' /> : <Form />} />
        <Route path='/administrativeworld/home' element={loggedIn ? <Dashboard /> : <Navigate to='/login' />} />
        <Route path='*' element={<Navigate to="/login" />} />
      </Routes>
      <PWABadge />
    </div>
  );
}

export default App;
