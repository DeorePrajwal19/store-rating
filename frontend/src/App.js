import React, {useState} from 'react';
import axios from 'axios';
const API = process.env.REACT_APP_API || 'http://localhost:5000/api';
function App(){
  const [view,setView] = useState('home');
  const [token,setToken] = useState(localStorage.getItem('token')||'');
  const [stores,setStores] = useState([]);
  const [form,setForm] = useState({name:'',email:'',address:'',password:''});
  const signup = async ()=>{ try{ await axios.post(API+'/auth/signup', form); alert('signed up - now login'); setView('login'); }catch(e){ alert(e?.response?.data?.error||e.message)} }
  const login = async ()=>{ try{ const res=await axios.post(API+'/auth/login', {email:form.email,password:form.password}); localStorage.setItem('token', res.data.token); setToken(res.data.token); setView('stores'); }catch(e){ alert(e?.response?.data?.error||e.message)} }
  const fetchStores = async ()=>{ try{ const res=await axios.get(API+'/stores', { headers:{ Authorization:'Bearer '+token }}); setStores(res.data); }catch(e){ alert(e?.response?.data?.error||e.message)} }
  return (<div style={{padding:20,fontFamily:'sans-serif'}}>
    <h2>FullStack Intern - Minimal App</h2>
    <div style={{marginBottom:10}}>
      <button onClick={()=>setView('home')}>Home</button>
      <button onClick={()=>setView('signup')}>Signup</button>
      <button onClick={()=>setView('login')}>Login</button>
      <button onClick={()=>{ localStorage.removeItem('token'); setToken(''); setView('home'); }}>Logout</button>
    </div>
    {view==='home' && <div><p>Welcome — please signup/login.</p></div>}
    {view==='signup' && <div>
      <h3>Signup</h3>
      <input placeholder='Name' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /><br/>
      <input placeholder='Email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /><br/>
      <input placeholder='Address' value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /><br/>
      <input placeholder='Password' type='password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /><br/>
      <button onClick={signup}>Signup</button>
    </div>}
    {view==='login' && <div>
      <h3>Login</h3>
      <input placeholder='Email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /><br/>
      <input placeholder='Password' type='password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /><br/>
      <button onClick={login}>Login</button>
    </div>}
    {view==='stores' && <div>
      <h3>Stores</h3>
      <button onClick={fetchStores}>Load Stores</button>
      <ul>
        {stores.map(s=>(
          <li key={s.id}>
            <b>{s.name}</b> — {s.address} — Avg: {s.rating} — Your: {s.userRating||'-'}
          </li>
        ))}
      </ul>
    </div>}
  </div>);
}
export default App;
