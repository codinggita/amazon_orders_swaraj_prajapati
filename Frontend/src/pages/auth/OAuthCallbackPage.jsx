import { useEffect, useState } from 'react'; 
 import { useNavigate, useSearchParams } from 'react-router-dom'; 
 import toast from 'react-hot-toast'; 
 
 export default function OAuthCallbackPage() { 
   const navigate       = useNavigate(); 
   const [searchParams] = useSearchParams(); 
   const [status, setStatus] = useState('Processing...'); 
 
   useEffect(() => { 
     const token    = searchParams.get('token'); 
     const userStr  = searchParams.get('user'); 
     const provider = searchParams.get('provider'); 
     const error    = searchParams.get('error'); 
 
     if (error) { 
       toast.error(error || 'Authentication failed'); 
       navigate('/login'); 
       return; 
     } 
 
     if (!token || !userStr) { 
       toast.error('Authentication failed. Please try again.'); 
       navigate('/login'); 
       return; 
     } 
 
     try { 
       const user = JSON.parse(decodeURIComponent(userStr)); 
 
       // Save to localStorage (same keys as regular login) 
       localStorage.setItem('orderpulse_token', token); 
       localStorage.setItem('orderpulse_user',  JSON.stringify(user)); 
 
       // Save avatar if provided 
       if (user.avatarUrl) { 
         localStorage.setItem('orderpulse_avatar_url', user.avatarUrl); 
       } 
 
       setStatus(`Welcome back, ${user.name}!`); 
       toast.success( 
         `Signed in with ${provider === 'google' ? 'Google' : 'Facebook'}! 🎉` 
       ); 
 
       // Small delay for UX then redirect 
       setTimeout(() => navigate('/dashboard'), 800); 
 
     } catch (err) { 
       toast.error('Failed to process authentication'); 
       navigate('/login'); 
     } 
   }, [navigate, searchParams]); 
 
   return ( 
     <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"> 
       <div className="text-center"> 
 
         {/* Animated logo */} 
         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 
                         flex items-center justify-center mx-auto mb-6 
                         shadow-lg shadow-red-900/50 animate-pulse"> 
           <span className="font-logo text-2xl text-white">OP</span> 
         </div> 
 
         {/* Loading spinner */} 
         <div className="w-10 h-10 border-2 border-red-900/40 border-t-red-600 
                         rounded-full animate-spin mx-auto mb-6"/> 
 
         <p className="font-section text-[18px] text-white mb-2">{status}</p> 
         <p className="font-body-sm text-[12px] text-red-400/40"> 
           Redirecting to dashboard... 
         </p> 
       </div> 
     </div> 
   ); 
 } 
