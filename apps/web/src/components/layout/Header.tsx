import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { SignInUpModal } from '../../components';
import { ThemeToggle, cn } from '@repo/ui';
import { CiMenuKebab} from '../icons'
import { clearAuthStorage, isAuthenticated } from '../../helper/authHelpers';
import { baseApi } from '../../redux/api/baseApi';

const Header: React.FC = () => {
    const [loginIsOpen, setLoginIsOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState(isAuthenticated());
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    
    const handelLogout = () => {
        clearAuthStorage();
        dispatch(baseApi.util.resetApiState());
        setStatus(false);
        navigate('/');
    };

    return (
        <>
            <div className={cn('fixed w-full h-16 flex justify-between items-center bg-header-background dark:bg-header-background-dark px-10 z-50')} >
                {status ? (
                    <>
                        <div className={cn('lg:hidden')}>
                            <button onClick={() => setIsOpen(!isOpen)}> <CiMenuKebab fontSize="35px" className={cn('text-text-300 dark:text-text-dark-100 cursor-pointer')}/> </button>
                        </div>
                        <div id="logo" className={cn('hidden lg:block')}>
                            <h1 onClick={() => navigate('/')} className={cn('text-text-300 dark:text-text-dark-100 font-bold tracking-widest')}>S-BRAIN</h1>
                        </div>
                        
                    </>
                ) : (
                    <div id="logo">
                        <h1 onClick={() => navigate('/')} className={cn('text-text-300 dark:text-text-dark-100 font-bold tracking-widest')}>S-BRAIN</h1>
                    </div>
                )}

                <div id="auth-items" className={cn('flex items-center gap-4')}>
                    <div>
                        <ThemeToggle />
                    </div>
                    <div className={cn('rounded-sm py-2 px-4 cursor-pointer')}>
                        {status ? (
                            <button onClick={handelLogout} className={cn('font-medium text-[#ff0000] cursor-pointer')}>
                                Logout
                            </button>
                        ) : (
                            <>
                                <button onClick={() => setLoginIsOpen(true)} className={cn('font-medium text-text-300 dark:text-text-dark-100 cursor-pointer')}>
                                    Login
                                </button>
                                <SignInUpModal
                                    isOpen={loginIsOpen}
                                    onClose={() => setLoginIsOpen(false)}
                                    onSuccess={() => {
                                        setStatus(true);
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;